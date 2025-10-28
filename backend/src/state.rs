use std::sync::Arc;

use sqlx::PgPool;

use crate::{
    config::CONFIG,
    service::auth::{JwtService, TokenService},
};

pub struct ApiState {
    pub database: PgPool,
    pub token_service: TokenService,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let database = PgPool::connect(&CONFIG.database_url).await.unwrap();

        let token_service = TokenService {
            access: JwtService::new(&CONFIG.jwt.secret, CONFIG.jwt.expired_in),
            refresh: JwtService::new(&CONFIG.jwt.refresh_secret, CONFIG.jwt.refresh_expired_in),
        };

        Arc::new(Self {
            database,
            token_service,
        })
    }
}
