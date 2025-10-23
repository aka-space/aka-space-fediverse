use chrono::{DateTime, Utc};
use sqlx::PgExecutor;
use uuid::Uuid;

pub struct Account {
    pub id: Uuid,

    pub email: String,
    pub username: String,
    pub password: String,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn create(
    email: &str,
    username: &str,
    password: Option<&str>,
    executor: impl PgExecutor<'_>,
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
    .fetch_one(executor)
    .await
}

pub async fn get(id: Uuid, executor: impl PgExecutor<'_>) -> sqlx::Result<Account> {
    sqlx::query_as!(
        Account,
        r#"
            SELECT *
            FROM account.accounts
            WHERE id = $1
        "#,
        id
    )
    .fetch_one(executor)
    .await
}

pub async fn get_by_email(email: &str, executor: impl PgExecutor<'_>) -> sqlx::Result<Account> {
    sqlx::query_as!(
        Account,
        r#"
            SELECT *
            FROM account.accounts
            WHERE email = $1
        "#,
        email
    )
    .fetch_one(executor)
    .await
}
