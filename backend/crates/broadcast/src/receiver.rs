use std::{marker::PhantomData, str::FromStr};

use anyhow::Result;
use futures::{Stream, StreamExt};
use lapin::{
    Connection, Consumer, ExchangeKind,
    message::Delivery,
    options::{BasicConsumeOptions, ExchangeDeclareOptions, QueueBindOptions, QueueDeclareOptions},
    types::FieldTable,
};
use serde::Deserialize;

pub struct Receiver<E: FromStr + AsRef<str>, T: for<'de> Deserialize<'de>> {
    pub inner: Consumer,
    _phantom: PhantomData<(E, T)>,
}

impl<E: FromStr + AsRef<str>, T: for<'de> Deserialize<'de>> Receiver<E, T> {
    pub async fn new(
        exchange: String,
        tag: String,
        events: &[E],
        connection: &Connection,
    ) -> Result<Self> {
        let channel = connection.create_channel().await?;
        channel
            .exchange_declare(
                &exchange,
                ExchangeKind::Topic,
                ExchangeDeclareOptions {
                    durable: true,
                    ..Default::default()
                },
                FieldTable::default(),
            )
            .await?;

        let merged_queue_name = format!("{tag}.{exchange}");
        channel
            .queue_declare(
                &merged_queue_name,
                QueueDeclareOptions {
                    durable: true,
                    ..Default::default()
                },
                FieldTable::default(),
            )
            .await?;

        for event in events {
            channel
                .queue_bind(
                    &merged_queue_name,
                    &exchange,
                    event.as_ref(),
                    QueueBindOptions::default(),
                    FieldTable::default(),
                )
                .await?;
        }

        channel
            .basic_qos(1, lapin::options::BasicQosOptions::default())
            .await?;

        let inner = channel
            .basic_consume(
                &merged_queue_name,
                &tag,
                BasicConsumeOptions::default(),
                FieldTable::default(),
            )
            .await?;

        Ok(Self {
            inner,
            _phantom: Default::default(),
        })
    }

    fn deserialize(delivery: &Delivery) -> Result<T> {
        let body = std::str::from_utf8(&delivery.data)?;

        let data: T = serde_json::from_str(body)?;

        Ok(data)
    }

    async fn handle_delivery(delivery: lapin::Result<Delivery>) -> Result<T> {
        let delivery = delivery?;

        let data = match Self::deserialize(&delivery) {
            Ok(d) => d,
            Err(error) => {
                delivery
                    .nack(lapin::options::BasicNackOptions {
                        requeue: false,
                        ..Default::default()
                    })
                    .await?;

                return Err(error);
            }
        };

        Ok(data)
    }

    pub async fn next(&mut self) -> Option<Result<T>> {
        let delivery = self.inner.next().await?;

        Some(Self::handle_delivery(delivery).await)
    }

    pub fn stream(self) -> impl Stream<Item = Result<T>> {
        self.inner.then(Self::handle_delivery)
    }
}
