use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};
use sqlx::PgExecutor;
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, sqlx::Type, Serialize, Deserialize)]
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

pub async fn get_reactions(
    id: Uuid,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<BTreeMap<Reaction, i64>> {
    let raw = sqlx::query!(
        r#"
            SELECT kind as "kind: Reaction", COUNT(account_id) as count
            FROM post_reactions
            WHERE post_id = $1
            GROUP BY kind
        "#,
        id
    )
    .fetch_one(executor)
    .await;

    Ok(BTreeMap::from_iter(
        raw.into_iter()
            .map(|row| (row.kind, row.count.unwrap_or(0))),
    ))
}
