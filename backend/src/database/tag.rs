use sqlx::PgExecutor;
use uuid::Uuid;

pub async fn get_all(executor: impl PgExecutor<'_>) -> sqlx::Result<Vec<String>> {
    sqlx::query_scalar!("SELECT name FROM tags")
        .fetch_all(executor)
        .await
}

pub async fn get_by_post(
    post_id: Uuid,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Vec<String>> {
    sqlx::query_scalar!(
        r#"
            SELECT name
            FROM tags
            WHERE id IN (
                SELECT tag_id
                FROM post_tags
                WHERE post_id = $1
            )
        "#,
        post_id
    )
    .fetch_all(executor)
    .await
}

pub async fn create(tags: &[String], executor: impl PgExecutor<'_>) -> sqlx::Result<()> {
    sqlx::query!(
        r#"
            INSERT INTO tags (name)
            SELECT * FROM UNNEST($1::VARCHAR(64)[])
            ON CONFLICT DO NOTHING
        "#,
        tags
    )
    .execute(executor)
    .await?;

    Ok(())
}
