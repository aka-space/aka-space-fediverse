use redis::{AsyncTypedCommands, aio::MultiplexedConnection};
use serde::{Serialize, de::DeserializeOwned};
use uuid::Uuid;

use crate::error::{Error, Result};

pub struct RedisService {
    pub connection: MultiplexedConnection,
}

impl RedisService {
    pub async fn new(redis_url: &str) -> Result<Self> {
        let client = match redis::Client::open(redis_url) {
            Ok(client) => client,
            Err(error) => {
                tracing::error!(?error, "Failed to init redis client");

                return Err(Error::internal());
            }
        };
        let connection = match client.get_multiplexed_async_connection().await {
            Ok(connection) => connection,
            Err(error) => {
                tracing::error!(?error, "Failed to init redis connection");

                return Err(Error::internal());
            }
        };

        Ok(Self { connection })
    }

    pub async fn set<T: Serialize>(&self, prefix: &str, value: &T) -> Result<String> {
        let mut connection = self.connection.clone();

        let Ok(serialized) = serde_json::to_string(value) else {
            tracing::error!("Failed to serialize");

            return Err(Error::internal());
        };

        let redis_key = format!("{}:{}", prefix, Uuid::new_v4());

        if let Err(error) = connection.set(&redis_key, serialized).await {
            tracing::error!(?error, "Failed to store in redis");

            return Err(Error::internal());
        }

        Ok(redis_key)
    }

    pub async fn get<T: DeserializeOwned>(&self, key: &str) -> Result<Option<T>> {
        let mut connection = self.connection.clone();

        let raw = match connection.get(key).await {
            Ok(Some(raw)) => raw,
            Ok(None) => return Ok(None),
            Err(error) => {
                tracing::error!(?error, "Failed to get from redis");

                return Err(Error::internal());
            }
        };

        match serde_json::from_str(&raw) {
            Ok(value) => Ok(Some(value)),
            Err(error) => {
                tracing::error!(?error, "Failed to deserialize");

                Err(Error::internal())
            }
        }
    }
}
