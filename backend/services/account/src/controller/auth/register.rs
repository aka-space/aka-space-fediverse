use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use broadcast::queue::account::Event;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    config::CONFIG,
    database::account,
    error::{Error, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema, Validate)]
#[schema(as = auth::register::Request)]
pub struct Request {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 1))]
    pub username: String,

    #[validate(length(min = 8))]
    pub password: String,
}

#[axum::debug_handler]
#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/register",
    request_body = Request,
)]
pub async fn register(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(request): Json<Request>,
) -> Result<CookieJar> {
    request.validate()?;

    let hashed_password =
        match bcrypt::hash_with_salt(&request.password, CONFIG.bcrypt_cost, CONFIG.bcrypt_salt) {
            Ok(hashed_password) => hashed_password.to_string(),
            Err(error) => {
                tracing::error!(?error, "Failed to hash password");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Invalid password".into())
                    .build());
            }
        };

    let minimal_account = match account::create(
        &request.email,
        &request.username,
        Some(&hashed_password),
        &state.database_pool,
    )
    .await
    {
        Ok(id) => id,
        Err(error) => {
            tracing::error!(?error, "Failed to create account");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid register data".into())
                .build());
        }
    };
    let id = minimal_account.id;

    if let Err(error) = state
        .account_sender
        .send(&Event::Create, &minimal_account)
        .await
    {
        tracing::error!(?error, ?id, "Failed to send create account event to queue");
    }
    tracing::info!("Account sent");

    let token = match state.jwt.encode(id) {
        Ok(token) => token,
        Err(error) => {
            tracing::error!(?error, "Failed to create token");

            return Err(Error::internal());
        }
    };
    tracing::info!(token, ?id, "Token created");

    Ok(cookie::add(cookie::TOKEN_KEY, token, jar))
}
