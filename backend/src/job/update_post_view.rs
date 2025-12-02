use std::{sync::Arc, time::Duration};

use futures::{
    StreamExt,
    stream::{self},
};
use redis::AsyncCommands;
use uuid::Uuid;

use crate::{constant, database, error::ApiResult, state::ApiState};

const BATCH_SIZE: usize = 128;
pub const DELAY: Duration = Duration::from_secs(60 * 60);

#[tracing::instrument(err(Debug), skip(state))]
pub async fn run(state: Arc<ApiState>) -> ApiResult<()> {
    let mut connection = state.redis_service.connection.clone();

    let dirty_key = format!("{}:dirty", constant::POST_PREFIX);

    let ids: Vec<String> = redis::cmd("SPOP")
        .arg(&dirty_key)
        .arg(BATCH_SIZE)
        .query_async(&mut connection)
        .await?;
    tracing::info!(?ids, "Update post view");
    let entries = stream::iter(ids.into_iter()).then(|id| async {
        let mut connection = connection.clone();

        let hll_key = format!("{}:{}:hll", constant::POST_PREFIX, &id);

        connection
            .pfcount::<'_, _, i32>(&hll_key)
            .await
            .map(|view| (id, view))
    });
    tokio::pin!(entries);

    let mut transaction = state.database.begin().await?;
    while let Some(entry) = entries.next().await {
        let (id, view) = entry?;
        let id = Uuid::parse_str(&id)?;
        database::post::update(id, None, &None, Some(view), &mut *transaction).await?;
    }
    transaction.commit().await?;

    Ok(())
}
