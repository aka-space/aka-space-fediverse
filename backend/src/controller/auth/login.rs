use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    database::account,
    error::{Error, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema, Validate)]
#[schema(
    as = auth::login::Request,
    example = json!({
        "email": "user@example.com",
        "password": "12345678"
    })
)]
pub struct Request {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8))]
    pub password: String,
}

#[utoipa::path(
    post,
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
            body = Error
        ),
        (
            status = 500,
            description = "Internal server error",
            body = Error
        )
    )
)]
pub async fn login(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(request): Json<Request>,
) -> Result<(CookieJar, String)> {
    request.validate()?;

    let account = match account::get_by_email(&request.email, &state.database).await {
        Ok(Some(account)) => account,
        Ok(None) => {
            tracing::warn!(email = request.email, "No account with given email",);

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login credential".into())
                .build());
        }
        Err(error) => {
            tracing::warn!(?error, "Failed to fetch account");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login credential".into())
                .build());
        }
    };

    match bcrypt::verify(&request.password, &account.password) {
        Ok(true) => {}
        Ok(false) => {
            tracing::warn!("Login failed");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login credential".into())
                .build());
        }
        Err(error) => {
            tracing::error!(?error, "Failed to verify password");

            return Err(Error::internal());
        }
    }

    let (access, refresh) = state.token_service.encode(account.id)?;

    tracing::info!(access, ?refresh, ?account.id, "Token created");

    Ok((jar.add(refresh), access))
}
