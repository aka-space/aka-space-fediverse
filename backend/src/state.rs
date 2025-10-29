use std::{collections::HashMap, sync::Arc};

use sqlx::PgPool;

use crate::{
    config::{CONFIG, Provider},
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
    pub async fn new() -> Arc<Self> {
        let database = PgPool::connect(&CONFIG.database_url).await.unwrap();

        let redis_client = redis::Client::open(CONFIG.redis_url.as_str()).unwrap();
        let redis_connection = redis_client
            .get_multiplexed_async_connection()
            .await
            .unwrap();
        let redis_service = RedisService {
            connection: redis_connection,
        };

        let token_service = TokenService {
            access: JwtService::new(&CONFIG.jwt.secret, CONFIG.jwt.expired_in),
            refresh: JwtService::new(&CONFIG.jwt.refresh_secret, CONFIG.jwt.refresh_expired_in),
            refresh_tokens: Default::default(),
        };

        let mut oauth2_services = HashMap::new();
        for (provider, config) in CONFIG.oauth2.clone() {
            let service = OAuth2Service::new(config).await;
            oauth2_services.insert(provider, service);
        }

        Arc::new(Self {
            database,
            redis_service,
            token_service,
            oauth2_services,
        })
    }
}
