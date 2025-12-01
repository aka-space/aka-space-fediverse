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
pub async fn refresh(
    State(state): State<Arc<ApiState>>,
    jar: CookieJar,
) -> ApiResult<(CookieJar, String)> {
    let token_service = &state.token_service;

    let cookie = jar
        .get(REFRESH_COOKIE)
        .cloned()
        .with_context(StatusCode::UNAUTHORIZED, "Missing refresh token")?;

    let token = cookie.value();
    let id = token_service.refresh.decode(token)?;
    if let Some(mut tokens) = token_service.refresh_tokens.get_mut(&id) {
        tokens.remove(token);
    }

    let (access, refresh) = state.token_service.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((jar.add(refresh), access))
}
