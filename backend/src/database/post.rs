use chrono::{DateTime, Utc};
use sqlx::PgExecutor;
use sqlx_conditional_queries::conditional_query_as;
use uuid::Uuid;

use crate::database::{Pagination, Sort, SortDirection};

#[derive(Debug)]
pub struct Post {
    id: Uuid,
    slug: String,

    author_id: Uuid,
    title: String,
    content: String,
    view: i32,

    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

pub async fn create(
    author_id: Uuid,
    title: &str,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO posts(author_id, title, content)
            VALUES($1, $2, $3)
            RETURNING id
        "#,
        author_id,
        title,
        content
    )
    .fetch_one(executor)
    .await
}

#[derive(Default)]
pub enum SortablePostColumn {
    #[default]
    Id,
    View,
    CreatedAt,
}

pub async fn get_all(
    sort: Sort<SortablePostColumn>,
    Pagination { limit, offset }: Pagination,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Vec<Post>> {
    conditional_query_as!(
        Post,
        r#"
            SELECT
                id,
                slug,
                author_id,
                title,
                content,
                view,
                created_at,
                updated_at
            FROM posts
            ORDER BY {#column} {#direction}
            LIMIT {limit}
            OFFSET {offset}
        "#,
        #column = match sort.column {
            SortablePostColumn::Id => "id",
            SortablePostColumn::View => "view",
            SortablePostColumn::CreatedAt => "created_at",
        },
        #direction = match sort.direction {
            SortDirection::Ascending => "ASC",
            SortDirection::Descending => "DESC",
        },
    )
    .fetch_all(executor)
    .await
}

pub async fn get(slug: String, executor: impl PgExecutor<'_>) -> sqlx::Result<Option<Post>> {
    sqlx::query_as!(
        Post,
        r#"
            SELECT
                id,
                slug,
                author_id,
                title,
                content,
                view,
                created_at,
                updated_at
            FROM posts
            WHERE slug = $1
        "#,
        slug
    )
    .fetch_optional(executor)
    .await
}
