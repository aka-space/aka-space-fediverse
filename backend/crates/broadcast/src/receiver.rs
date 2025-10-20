use std::{marker::PhantomData, str::FromStr};

use anyhow::Result;
use lapin::{
    Connection, Consumer, ExchangeKind,
    options::{BasicConsumeOptions, ExchangeDeclareOptions, QueueBindOptions, QueueDeclareOptions},
    types::FieldTable,
};

pub struct Receiver<E: FromStr + AsRef<str>, T> {
    pub inner: Consumer,
    _phantom: PhantomData<(E, T)>,
}

impl<E: FromStr + AsRef<str>, T> Receiver<E, T> {
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
}
