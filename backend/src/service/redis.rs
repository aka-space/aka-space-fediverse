use redis::{AsyncTypedCommands, aio::MultiplexedConnection};
use serde::{Serialize, de::DeserializeOwned};
use uuid::Uuid;

use crate::error::ApiResult;

pub struct RedisService {
    pub connection: MultiplexedConnection,
    pub cache_ttl: u64,
}

impl RedisService {
    #[tracing::instrument(err(Debug))]
    pub async fn new(redis_url: &str, cache_ttl: u64) -> ApiResult<Self> {
        let client = redis::Client::open(redis_url)?;
        let connection = client.get_multiplexed_async_connection().await?;

        Ok(Self {
            connection,
            cache_ttl,
        })
    }

    #[tracing::instrument(err(Debug), skip(self))]
    pub async fn set_ex<T: Serialize + std::fmt::Debug>(
        &self,
        prefix: &str,
        value: &T,
    ) -> ApiResult<String> {
        let mut connection = self.connection.clone();

        let serialized = serde_json::to_string(value)?;

        let redis_key = format!("{}:{}", prefix, Uuid::new_v4());
        connection
            .set_ex(&redis_key, serialized, self.cache_ttl)
            .await?;

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

    pub async fn pfadd(&self, prefix: &str, id: &str, element: &[u8]) -> ApiResult<()> {
        let mut connection = self.connection.clone();

        let hll_key = format!("{prefix}:{id}:hll");
        let dirty_key = format!("{prefix}:dirty");

        let mut pipe = redis::pipe();
        pipe.atomic().pfadd(hll_key, element).sadd(dirty_key, id);
        pipe.query_async::<()>(&mut connection).await?;

        Ok(())
    }
}
