use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    config::CONFIG,
    database,
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
};

#[derive(Debug, Deserialize, ToSchema, Validate)]
#[schema(example = json!({
    "email": "user@example.com",
    "username": "user",
    "password": "12345678"
}))]
#[schema(as = auth::register::Request)]
pub struct Request {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 1))]
    pub username: String,

    #[validate(length(min = 8))]
    pub password: String,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/register",
    request_body = Request,
    responses(
        (
            status = 201,
            description = "Account created. Returns access token in body and sets refresh token cookie.",
            body = String,
            headers(
                ("Set-Cookie" = String)
            )
        ),
        (
            status = 400,
            description = "Invalid registration data",
            body = ApiError
        ),
        (
            status = 500,
            description = "Internal server error",
            body = ApiError
        )
    )
)]
#[tracing::instrument(err(Debug), skip(state, jar))]
pub async fn register(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(request): Json<Request>,
) -> ApiResult<(StatusCode, CookieJar, String)> {
    request.validate()?;

    let hashed_password =
        bcrypt::hash_with_salt(&request.password, CONFIG.bcrypt.cost, CONFIG.bcrypt.salt)
            .with_context(StatusCode::BAD_REQUEST, "Invalid password")?;
    let id = database::account::create(
        &request.email,
        &request.username,
        Some(&hashed_password.to_string()),
        &state.database,
    )
    .await
    .with_context(StatusCode::BAD_REQUEST, "Invalid register data")?;

    let (access, refresh) = state.token_service.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((StatusCode::CREATED, jar.add(refresh), access))
}
