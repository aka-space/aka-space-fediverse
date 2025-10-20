use std::{marker::PhantomData, str::FromStr};

use anyhow::Result;
use lapin::{BasicProperties, Channel, options::BasicPublishOptions};
use serde::Serialize;

pub struct Sender<E: AsRef<str>, T: Serialize> {
    pub channel: Channel,
    pub exchange: String,
    _phantom: PhantomData<(E, T)>,
}

impl<E: AsRef<str>, T: Serialize> Sender<E, T> {
    pub async fn send(&self, event: &E, data: &T) -> Result<()> {
        let serialized = serde_json::to_vec(data)?;

        self.channel.basic_publish(
            &self.exchange,
            event.as_ref(),
            BasicPublishOptions::default(),
            &serialized,
            BasicProperties::default().with_delivery_mode(2),
        );

        todo!()
    }
}
