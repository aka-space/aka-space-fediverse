use axum_extra::extract::cookie::{Cookie, SameSite};
use redis::{AsyncTypedCommands, aio::MultiplexedConnection};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    config::SESSION_PREFIX,
    error::{Error, Result},
};

pub struct SessionService {
    pub redis: MultiplexedConnection,
}

impl SessionService {
    pub async fn store<T: Serialize>(&self, key: String, value: &T) -> Result<Cookie<'static>> {
        let Ok(serialized) = serde_json::to_string(value) else {
            tracing::error!("Failed to serialize");

            return Err(Error::internal());
        };

        let mut connection = self.redis.clone();
        let redis_key = format!("{}:{}", SESSION_PREFIX, Uuid::new_v4());

        if let Err(error) = connection.set(&redis_key, serialized).await {
            tracing::error!(?error, "Failed to store in redis");

            return Err(Error::internal());
        }

        let mut cookie = Cookie::new(key, redis_key);
        cookie.set_http_only(true);
        cookie.set_same_site(Some(SameSite::None));
        cookie.set_secure(true);

        Ok(cookie)
    }
}
