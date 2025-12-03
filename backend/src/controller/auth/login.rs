use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    database, ensure,
    error::{ApiError, ApiResult, OptionExt, ResultExt},
    state::ApiState,
};

#[derive(Debug, Deserialize, ToSchema, Validate)]
#[schema(example = json!({
    "email": "user@example.com",
    "password": "12345678"
}))]
#[schema(as = auth::login::Request)]
pub struct Request {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8))]
    pub password: String,
}

#[utoipa::path(
    post,
    operation_id = "auth::login",
    tag = "Auth",
    path = "/auth/login",
    request_body = Request,
    responses(
        (
            status = 200,
            description = "Login successful. Response body contains access token. Refresh token is set in `Set-Cookie` header.",
            body = String,
            headers(
                ("Set-Cookie" = String)
            ),
        ),
        (
            status = 400,
            description = "Invalid login credential",
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
pub async fn login(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(request): Json<Request>,
) -> ApiResult<(CookieJar, String)> {
    request.validate()?;

    let opt_account = database::account::get_by_email(&request.email, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid login credential")?;
    let account = opt_account.with_context(StatusCode::BAD_REQUEST, "Invalid login credential")?;

    let is_password_valid = bcrypt::verify(&request.password, &account.password)?;
    ensure!(
        is_password_valid,
        StatusCode::BAD_REQUEST,
        "Invalid login credential"
    );

    let (access, refresh) = state.token.encode(account.id)?;

    tracing::info!(access, ?refresh, ?account.id, "Token created");

    Ok((jar.add(refresh), access))
}
