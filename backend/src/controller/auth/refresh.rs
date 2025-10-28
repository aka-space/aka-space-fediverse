use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;

use crate::{
    config::REFRESH_COOKIE,
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/refresh",
    responses(
        (
            status = 200,
            description = "Refresh successful. New access token returned in body and new refresh token set via Set-Cookie header.",
            body = String,
            headers(
                ("Set-Cookie" = String)
            )
        ),
        (
            status = 401,
            description = "Missing or invalid refresh token",
            body = Error
        ),
        (
            status = 500,
            description = "Internal server error",
            body = Error
        )
    )
)]
pub async fn refresh(
    State(state): State<Arc<ApiState>>,
    jar: CookieJar,
) -> Result<(CookieJar, String)> {
    let token_service = &state.token_service;

    let Some(cookie) = jar.get(REFRESH_COOKIE).cloned() else {
        tracing::warn!("Missing refresh token");

        return Err(Error::builder()
            .status(StatusCode::UNAUTHORIZED)
            .message("Missing refresh token".into())
            .build());
    };
    let token = cookie.value();
    let Ok(id) = token_service.refresh.decode(token) else {
        tracing::warn!("Receive invalid refresh token");

        return Err(Error::builder()
            .status(StatusCode::UNAUTHORIZED)
            .message("Invalid refresh token".into())
            .build());
    };

    let (access, refresh) = state.token_service.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((jar.add(refresh), access))
}
