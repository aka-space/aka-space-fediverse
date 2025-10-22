use std::sync::Arc;

use broadcast::{Sender, queue::account};
use json_web_token::Jwt;
use lapin::Connection;

use crate::config::CONFIG;

pub struct ApiState {
    pub jwt: Jwt,
    pub account_sender: Sender<account::Event, account::Data>,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let jwt = Jwt::new(CONFIG.jwt_secret.as_bytes(), CONFIG.jwt_expired_in);

        let connection =
            Connection::connect(&CONFIG.amqp_url, lapin::ConnectionProperties::default())
                .await
                .unwrap();

        let account_sender = Sender::new(account::EXCHANGE.to_string(), &connection)
            .await
            .unwrap();

        Arc::new(Self {
            jwt,
            account_sender,
        })
    }
}
