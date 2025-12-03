use sqlx::PgExecutor;

pub async fn get_all(executor: impl PgExecutor<'_>) -> sqlx::Result<Vec<String>> {
    sqlx::query_scalar!("SELECT name FROM tags")
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
