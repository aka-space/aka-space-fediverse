use redis::{AsyncTypedCommands, aio::MultiplexedConnection};
use serde::{Serialize, de::DeserializeOwned};
use uuid::Uuid;

use crate::error::ApiResult;

const DIRTY_POST_KEY: &str = "post:hll:dirty";

#[inline]
fn get_post_hll_key(post_id: Uuid) -> String {
    format!("post:{post_id}:hll")
}

#[inline]
fn get_post_view_key(post_id: Uuid) -> String {
    format!("post:{post_id}:view")
}

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

    pub async fn increase_post_view(&self, post_id: Uuid, hashed_id: &str) -> ApiResult<()> {
        let mut connection = self.connection.clone();

        let hll_key = get_post_hll_key(post_id);

        let mut pipe = redis::pipe();
        pipe.atomic()
            .pfadd(hll_key, hashed_id)
            .sadd(DIRTY_POST_KEY, post_id.to_string());
        pipe.query_async::<()>(&mut connection).await?;

        Ok(())
    }

    pub async fn count_post_view(&self, post_id: Uuid) -> ApiResult<usize> {
        let mut connection = self.connection.clone();

        let view_key = get_post_view_key(post_id);

        let cached = connection.get(&view_key).await?;
        if let Some(view) = cached {
            let view = view.parse()?;

            return Ok(view);
        }

        let hll_key = get_post_hll_key(post_id);
        let view = connection.pfcount(hll_key).await?;

        connection.set(&view_key, view).await?;

        Ok(view)
    }
}
