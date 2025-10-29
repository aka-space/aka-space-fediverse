use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::Redirect,
};
use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};

use crate::{
    config::{OAUTH2_TEMPORARY, Provider, REDIS_SESSION_PREFIX},
    error::Result,
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Auth",
    path = "/oauth2/{provider}/start",
    params(
        ("provider" = Provider, description = "OAuth2 Provider"),
    ),
)]
pub async fn start(
    State(state): State<Arc<ApiState>>,
    Path(provider): Path<Provider>,
    jar: CookieJar,
) -> Result<(CookieJar, Redirect)> {
    let (auth_url, csrf, nonce) = state.oauth2_services[&provider].start();

    let redis_key = state
        .redis_service
        .set(REDIS_SESSION_PREFIX, &(csrf, nonce))
        .await?;

    let mut cookie = Cookie::new(OAUTH2_TEMPORARY, redis_key);
    cookie.set_http_only(true);
    cookie.set_same_site(Some(SameSite::None));
    cookie.set_secure(true);

    Ok((jar.add(cookie), Redirect::to(auth_url.as_ref())))
}
