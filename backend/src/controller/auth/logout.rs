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
    path = "/auth/logout",
    security(("jwt_token" = [])),
    responses(
        (
            status = 200,
            description = "Logout successful. Refresh cookie removed.",
            headers(("Set-Cookie" = String))
        ),
        (
            status = 400,
            description = "Not logged in or invalid request",
            body = Error
        ),
        (
            status = 500,
            description = "Internal server error",
            body = Error
        )
    )
)]
pub async fn logout(State(state): State<Arc<ApiState>>, jar: CookieJar) -> Result<CookieJar> {
    let token_service = &state.token_service;

    let Some(mut cookie) = jar.get(REFRESH_COOKIE).cloned() else {
        tracing::warn!("Trying to logout before login");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Login first before logout".into())
            .build());
    };
    cookie.make_removal();

    let token = cookie.value();
    let Ok(id) = token_service.refresh.decode(token) else {
        tracing::warn!("Receive invalid token");

        return Ok(jar.remove(cookie));
    };

    if let Some(mut tokens) = token_service.refresh_tokens.get_mut(&id) {
        tokens.remove(token);
    }

    Ok(jar.remove(cookie))
}
