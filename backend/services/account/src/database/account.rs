use sqlx::PgExecutor;
use uuid::Uuid;

pub async fn create(
    email: &str,
    username: &str,
    password: Option<&str>,
    database: impl PgExecutor<'_>,
) -> sqlx::Result<Uuid> {
    sqlx::query_scalar!(
        r#"
            INSERT INTO account.accounts(email, username, password)
            VALUES($1, $2, COALESCE($3, substr(md5(random()::text), 1, 25)))
            RETURNING id
        "#,
        email,
        username,
        password
    )
    .fetch_one(database)
    .await
}
