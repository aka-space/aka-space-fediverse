use std::{collections::HashMap, sync::Arc};

use sqlx::PgPool;

use crate::{
    config::{CONFIG, Provider},
    error::ApiResult,
    service::{
        auth::{JwtService, OAuth2Service, TokenService},
        redis::RedisService,
    },
};

pub struct ApiState {
    pub database: PgPool,
    pub redis_service: RedisService,
    pub token_service: TokenService,
    pub oauth2_services: HashMap<Provider, OAuth2Service>,
}

impl ApiState {
    pub async fn new() -> ApiResult<Arc<Self>> {
        let database = PgPool::connect(&CONFIG.database_url).await?;
        sqlx::migrate!().run(&database).await?;

        let redis_service = RedisService::new(&CONFIG.redis_url).await?;

        let token_service = TokenService {
            access: JwtService::new(&CONFIG.jwt.secret, CONFIG.jwt.expired_in),
            refresh: JwtService::new(&CONFIG.jwt.refresh_secret, CONFIG.jwt.refresh_expired_in),
            refresh_tokens: Default::default(),
        };

        let mut oauth2_services = HashMap::new();
        for (provider, config) in CONFIG.oauth2.clone() {
            let service = OAuth2Service::new(config).await?;
            oauth2_services.insert(provider, service);
        }

        Ok(Arc::new(Self {
            database,
            redis_service,
            token_service,
            oauth2_services,
        }))
    }
}
