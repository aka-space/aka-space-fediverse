use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::Redirect,
};
use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};
use redis::AsyncTypedCommands;
use uuid::Uuid;

use crate::{
    config::{OAUTH2_TEMPORARY, Provider},
    error::{Error, Result},
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

    let Ok(stored) = serde_json::to_string(&(csrf, nonce)) else {
        tracing::error!("Failed to serialize");

        return Err(Error::internal());
    };

    let mut connection = state.redis_connection.clone();
    let id = Uuid::new_v4().to_string();
    if let Err(error) = connection.set(&id, stored).await {
        tracing::error!(?error, "Failed to store oauth2 csrf and nonce");

        return Err(Error::internal());
    }

    let mut cookie = Cookie::new(OAUTH2_TEMPORARY, id);
    cookie.set_http_only(true);
    cookie.set_same_site(Some(SameSite::None));
    cookie.set_secure(true);

    Ok((jar.add(cookie), Redirect::to(auth_url.as_ref())))
}
