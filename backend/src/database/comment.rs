use std::collections::HashMap;

use chrono::{DateTime, Utc};
use sqlx::PgExecutor;
use uuid::Uuid;

use crate::database::reaction::Reaction;

pub struct Comment {
    pub id: Uuid,
    pub parent_id: Option<Uuid>,
    pub children_count: i64,
    pub account_id: Uuid,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn create(
    post_id: Uuid,
    account_id: Uuid,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO comments(post_id, account_id, content)
            VALUES($1, $2, $3)
            RETURNING id
        "#,
        post_id,
        account_id,
        content,
    )
    .fetch_one(executor)
    .await
}

pub async fn reply(
    parent_id: Uuid,
    account_id: Uuid,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO comments(post_id, parent_id, account_id, content)
            SELECT c.post_id, $1, $2, $3
            FROM comments c
            WHERE id = $1
            RETURNING id
        "#,
        parent_id,
        account_id,
        content,
    )
    .fetch_one(executor)
    .await
}

pub async fn react(
    id: Uuid,
    account_id: Uuid,
    kind: Reaction,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            INSERT INTO comment_reactions(comment_id, account_id, kind)
            VALUES($1, $2, $3)
            ON CONFLICT DO NOTHING
        "#,
        id,
        account_id,
        kind as Reaction
    )
    .execute(executor)
    .await?;

    Ok(())
}

pub async fn get_by_post(
    post_id: Uuid,
    limit: i64,
    last_created_at: Option<DateTime<Utc>>,
    last_id: Option<Uuid>,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Vec<Comment>> {
    sqlx::query_as!(
        Comment,
        r#"
            SELECT
                id,
                parent_id,
                (SELECT COUNT(id) FROM comments WHERE parent_id = c.id) as "children_count!",
                account_id,
                content,
                created_at,
                updated_at
            FROM comments c
            WHERE 
                post_id = $1 AND
                parent_id IS NULL AND
                ($2::timestamptz IS NULL OR (created_at, id) < ($2, $3))
            ORDER BY created_at DESC, id DESC
            LIMIT $4
        "#,
        post_id,
        last_created_at,
        last_id,
        limit
    )
    .fetch_all(executor)
    .await
}

pub async fn get_child(
    parent_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Vec<Comment>> {
    sqlx::query_as_unchecked!(
        Comment,
        r#"
            SELECT
                id,
                parent_id,
                (SELECT COUNT(id) FROM comments WHERE parent_id = c.id) as children_count,
                account_id,
                content,
                created_at,
                updated_at
            FROM comments c
            WHERE parent_id = $1
            ORDER BY created_at DESC, id DESC
        "#,
        parent_id
    )
    .fetch_all(executor)
    .await
}

pub async fn count_reactions(
    id: Uuid,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<HashMap<Reaction, u64>> {
    let raw = sqlx::query!(
        r#"
            SELECT kind as "kind: Reaction", COUNT(account_id) as count
            FROM comment_reactions
            WHERE comment_id = $1
            GROUP BY kind
        "#,
        id
    )
    .fetch_one(executor)
    .await;

    Ok(HashMap::from_iter(
        raw.into_iter()
            .map(|row| (row.kind, row.count.unwrap_or(0) as u64)),
    ))
}

pub async fn update(
    id: Uuid,
    account_id: Uuid,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            UPDATE comments
            SET content = $3,
                updated_at = now()
            WHERE id = $1 AND account_id = $2
        "#,
        id,
        account_id,
        content
    )
    .execute(executor)
    .await?;

    Ok(())
}
