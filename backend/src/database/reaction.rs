use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::PgExecutor;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, Hash, sqlx::Type, Serialize, Deserialize, ToSchema)]
#[sqlx(rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum Reaction {
    Like,
    Love,
    Haha,
    Wow,
    Sad,
    Angry,
}

pub async fn react(
    post_id: Uuid,
    account_id: Uuid,
    kind: Reaction,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            INSERT INTO post_reactions(post_id, account_id, kind)
            VALUES($1, $2, $3)
        "#,
        post_id,
        account_id,
        kind as Reaction
    )
    .execute(executor)
    .await?;

    Ok(())
}

pub async fn count_by_post(
    post_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<HashMap<Reaction, u64>> {
    let raw = sqlx::query!(
        r#"
            SELECT kind as "kind: Reaction", COUNT(account_id) as count
            FROM post_reactions
            WHERE post_id = $1
            GROUP BY kind
        "#,
        post_id
    )
    .fetch_one(executor)
    .await;

    Ok(HashMap::from_iter(
        raw.into_iter()
            .map(|row| (row.kind, row.count.unwrap_or(0) as u64)),
    ))
}
