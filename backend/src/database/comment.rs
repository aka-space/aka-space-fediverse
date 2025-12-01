use chrono::{DateTime, Utc};
use serde::Deserialize;
use sqlx::PgExecutor;
use sqlx_conditional_queries::conditional_query_as;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::util::{Pagination, Sort, SortDirection};

pub struct Comment {
    pub id: Uuid,
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
            INSERT INTO post_comments(post_id, account_id, content)
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

#[derive(Debug, Default, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[schema(as = comment::SortableColumn)]
pub enum SortableColumn {
    #[default]
    CreatedAt,
    UpdatedAt,
}

pub async fn get_by_post(
    post_id: Uuid,
    sort: Sort<SortableColumn>,
    pagination: Pagination,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Vec<Comment>> {
    let limit = pagination.limit as i64;
    let offset = pagination.offset as i64;

    conditional_query_as!(
        Comment,
        r#"
            SELECT id, account_id, content, created_at, updated_at
            FROM post_comments
            WHERE post_id = {post_id}
            ORDER BY {#column} {#direction}
            LIMIT {limit}
            OFFSET {offset}
        "#,
        #column = match sort.column {
            SortableColumn::CreatedAt => "created_at",
            SortableColumn::UpdatedAt => "updated_at",
        },
        #direction = match sort.direction {
            SortDirection::Ascending => "ASC",
            SortDirection::Descending => "DESC",
        },
    )
    .fetch_all(executor)
    .await
}

pub async fn update(
    id: Uuid,
    account_id: Uuid,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            UPDATE post_comments
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
