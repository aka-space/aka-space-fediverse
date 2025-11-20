use chrono::{DateTime, Utc};
use serde::Deserialize;
use sqlx::PgExecutor;
use sqlx_conditional_queries::conditional_query_as;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::util::{Pagination, Sort, SortDirection};

#[derive(Debug)]
pub struct Post {
    pub id: Uuid,
    pub slug: String,

    pub author_id: Uuid,
    pub title: String,
    pub content: String,
    pub view: i32,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug)]
pub struct Key {
    pub id: Uuid,
    pub slug: String,
}

pub async fn create(
    author_id: Uuid,
    title: &str,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Key> {
    sqlx::query_as!(
        Key,
        r#"
            INSERT INTO posts(author_id, title, content)
            VALUES($1, $2, $3)
            RETURNING id, slug
        "#,
        author_id,
        title,
        content
    )
    .fetch_one(executor)
    .await
}

pub async fn add_tags(
    id: Uuid,
    tags: &[String],
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            INSERT INTO post_tags(post_id, tag_id)
            SELECT $1, tags.id
            FROM tags
            WHERE tags.name = ANY($2::text[])
        "#,
        id,
        tags
    )
    .execute(executor)
    .await?;

    Ok(())
}

#[derive(Default, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum SortableColumn {
    #[default]
    Id,
    View,
    CreatedAt,
}

pub async fn query(
    query: Option<&str>,
    tags: &[String],
    author_name: Option<&str>,
    sort: Sort<SortableColumn>,
    pagination: Pagination,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Vec<Post>> {
    let limit = pagination.limit as i64;
    let offset = pagination.offset as i64;

    conditional_query_as!(
        Post,
        r#"
            SELECT id, slug, author_id, title, content, view, created_at, updated_at
            FROM posts
            WHERE (
                {query}::text IS NULL OR
                (title LIKE '%' || {query} || '%' ) OR
                (content LIKE '%' || {query} || '%' )
            ) AND (
                cardinality({tags}::text[]) = 0 OR
                EXISTS (
                    SELECT 1
                    FROM tags
                    WHERE id IN (
                        SELECT tag_id 
                        FROM post_tags 
                        WHERE post_id = posts.id
                    )
                    AND name = ANY({tags})
                )
            ) AND (
                {author_name}::text IS NULL OR
                author_id = (SELECT id FROM accounts WHERE username = {author_name})
            )
            ORDER BY {#column} {#direction}
            LIMIT {limit}
            OFFSET {offset}
        "#,
        #column = match sort.column {
            SortableColumn::Id => "id",
            SortableColumn::View => "view",
            SortableColumn::CreatedAt => "created_at",
        },
        #direction = match sort.direction {
            SortDirection::Ascending => "ASC",
            SortDirection::Descending => "DESC",
        },
    )
    .fetch_all(executor)
    .await
}

pub async fn get_by_slug(slug: &str, executor: impl PgExecutor<'_>) -> sqlx::Result<Option<Post>> {
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

pub async fn update(
    id: Uuid,
    author_id: Uuid,
    content: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            UPDATE posts
            SET content = $3
            WHERE id = $1 AND author_id = $2
        "#,
        id,
        author_id,
        content
    )
    .execute(executor)
    .await?;

    Ok(())
}
