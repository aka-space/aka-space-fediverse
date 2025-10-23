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
#[schema(as = auth::login::Request)]
pub struct Request {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1))]
    pub password: String,
}

#[utoipa::path (
    post,
    tag = "Auth",
    path = "/auth/login",
    request_body = Request,
)]
pub async fn login(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(request): Json<Request>,
) -> Result<CookieJar> {
    request.validate()?;

    let account = match account::get_by_email(&request.email, &state.database_pool).await {
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

    let token = match state.jwt.encode(account.id) {
        Ok(token) => token,
        Err(error) => {
            tracing::error!(?error, "Failed to create token");

            return Err(Error::internal());
        }
    };
    tracing::info!(token, ?account.id, "Token created");

    Ok(cookie::add(cookie::TOKEN_KEY, token, jar))
}
