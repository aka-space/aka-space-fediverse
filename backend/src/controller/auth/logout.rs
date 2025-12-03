use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;

use crate::{
    config::REFRESH_COOKIE,
    error::{ApiError, ApiResult, OptionExt},
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
pub async fn logout(State(state): State<Arc<ApiState>>, jar: CookieJar) -> ApiResult<CookieJar> {
    let token_service = &state.token;

    let mut cookie = jar
        .get(REFRESH_COOKIE)
        .cloned()
        .with_context(StatusCode::BAD_REQUEST, "Login first before logout")?;
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
