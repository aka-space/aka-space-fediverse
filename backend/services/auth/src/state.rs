use std::sync::Arc;

use json_web_token::Jwt;

use crate::config::CONFIG;

pub struct ApiState {
    pub jwt: Jwt,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let jwt = Jwt::new(CONFIG.jwt_secret.as_bytes(), CONFIG.jwt_expired_in);

        Arc::new(Self { jwt })
    }
}
