use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
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
#[schema(
    as = auth::register::Request,
    example = json!({
        "email": "user@example.com",
        "username": "user",
        "password": "12345678"
    })
)]
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
            body = Error
        ),
        (
            status = 500,
            description = "Internal server error",
            body = Error
        )
    )
)]
pub async fn register(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    Json(request): Json<Request>,
) -> Result<(StatusCode, CookieJar, String)> {
    request.validate()?;

    let hashed_password =
        match bcrypt::hash_with_salt(&request.password, CONFIG.bcrypt.cost, CONFIG.bcrypt.salt) {
            Ok(hashed_password) => hashed_password.to_string(),
            Err(error) => {
                tracing::error!(?error, "Failed to hash password");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Invalid password".into())
                    .build());
            }
        };

    let id = match account::create(
        &request.email,
        &request.username,
        Some(&hashed_password),
        &state.database,
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

    let (access, refresh) = match state.token_service.encode(id) {
        Ok(token) => token,
        Err(error) => {
            tracing::error!(?error, "Failed to create token");

            return Err(Error::internal());
        }
    };
    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((StatusCode::CREATED, jar.add(refresh), access))
}
