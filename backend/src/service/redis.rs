use redis::{AsyncTypedCommands, aio::MultiplexedConnection};
use serde::{Serialize, de::DeserializeOwned};
use uuid::Uuid;

use crate::error::ApiResult;

pub struct RedisService {
    pub connection: MultiplexedConnection,
}

impl RedisService {
    #[tracing::instrument(err(Debug))]
    pub async fn new(redis_url: &str) -> ApiResult<Self> {
        let client = redis::Client::open(redis_url)?;
        let connection = client.get_multiplexed_async_connection().await?;

        Ok(Self { connection })
    }

    #[tracing::instrument(err(Debug), skip(self))]
    pub async fn set<T: Serialize + std::fmt::Debug>(
        &self,
        prefix: &str,
        value: &T,
    ) -> ApiResult<String> {
        let mut connection = self.connection.clone();

        let serialized = serde_json::to_string(value)?;

        let redis_key = format!("{}:{}", prefix, Uuid::new_v4());
        connection.set(&redis_key, serialized).await?;

        Ok(redis_key)
    }

    #[tracing::instrument(err(Debug), skip(self))]
    pub async fn get<T: DeserializeOwned>(&self, key: &str) -> ApiResult<Option<T>> {
        let mut connection = self.connection.clone();

        let Some(raw) = &connection.get(key).await? else {
            return Ok(None);
        };

        let data = serde_json::from_str(raw)?;

        Ok(data)
    }
}
