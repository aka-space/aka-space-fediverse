use sqlx::PgExecutor;
use uuid::Uuid;

#[derive(sqlx::Type)]
#[sqlx(rename_all = "snake_case")]
pub enum Role {
    Member,
    Admin,
}

// TODO: remove allow dead code
#[allow(dead_code)]
pub struct Account {
    pub id: Uuid,

    pub email: String,
    pub username: String,
    pub password: String,
    pub role: Role,
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

pub async fn get(id: Uuid, executor: impl PgExecutor<'_>) -> sqlx::Result<Option<Account>> {
    sqlx::query_as!(
        Account,
        r#"
            SELECT
                id,
                email,
                username,
                password,
                role as "role: Role"
            FROM account.accounts
            WHERE id = $1 AND is_active = true
            LIMIT 1
        "#,
        id
    )
    .fetch_optional(executor)
    .await
}

pub async fn get_by_email(
    email: &str,
    executor: impl PgExecutor<'_>,
) -> sqlx::Result<Option<Account>> {
    sqlx::query_as!(
        Account,
        r#"
            SELECT
                id,
                email,
                username,
                password,
                role as "role: Role"
            FROM account.accounts
            WHERE email = $1 and is_active = true
            LIMIT 1
        "#,
        email
    )
    .fetch_optional(executor)
    .await
}
