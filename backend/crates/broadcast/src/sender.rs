use std::marker::PhantomData;

use anyhow::Result;
use lapin::{
    BasicProperties, Channel, Connection, ExchangeKind,
    options::{BasicPublishOptions, ExchangeDeclareOptions},
    types::FieldTable,
};
use serde::Serialize;

pub struct Sender<E: AsRef<str>, T: Serialize> {
    pub channel: Channel,
    pub exchange: String,
    _phantom: PhantomData<(E, T)>,
}

impl<E: AsRef<str>, T: Serialize> Sender<E, T> {
    pub async fn new(exchange: String, connection: &Connection) -> Result<Self> {
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

        Ok(Self {
            channel,
            exchange,
            _phantom: Default::default(),
        })
    }

    pub async fn send(&self, event: &E, data: &T) -> Result<()> {
        let serialized = serde_json::to_vec(data)?;

        self.channel
            .basic_publish(
                &self.exchange,
                event.as_ref(),
                BasicPublishOptions::default(),
                &serialized,
                BasicProperties::default().with_delivery_mode(2),
            )
            .await?;

        todo!()
    }
}
