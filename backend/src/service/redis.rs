use redis::{AsyncTypedCommands, aio::MultiplexedConnection};
use serde::{Serialize, de::DeserializeOwned};
use uuid::Uuid;

use crate::error::{Error, Result};

pub async fn set<T: Serialize>(
    prefix: &str,
    value: &T,
    mut connection: MultiplexedConnection,
) -> Result<String> {
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

pub async fn get<T: DeserializeOwned>(
    key: &str,
    mut connection: MultiplexedConnection,
) -> Result<Option<T>> {
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
