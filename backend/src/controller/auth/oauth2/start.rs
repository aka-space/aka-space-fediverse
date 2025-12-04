use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::Redirect,
};
use axum_extra::{
    TypedHeader,
    extract::{
        CookieJar,
        cookie::{Cookie, SameSite},
    },
    headers::Referer,
};

use crate::{
    config::Provider,
    constant,
    controller::auth::oauth2::OAuth2Session,
    error::{ApiError, ApiResult},
    state::ApiState,
};

#[utoipa::path(
    get,
    operation_id = "auth::oauth2::start",
    tag = "Auth",
    path = "/oauth2/{provider}",
    params(
        ("provider" = Provider, description = "OAuth2 Provider (path parameter)"),
    ),
    responses(
        (
            status = 302,
            description = "Redirects user to provider authorization URL; sets temporary session cookie via Set-Cookie header.",
            headers(
                ("Set-Cookie" = String)
            )
        ),
        (
            status = 400,
            description = "Bad request (invalid provider or parameters)",
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
pub async fn start(
    State(state): State<Arc<ApiState>>,
    TypedHeader(referer): TypedHeader<Referer>,
    Path(provider): Path<Provider>,
    jar: CookieJar,
) -> ApiResult<(CookieJar, Redirect)> {
    let (auth_url, csrf, nonce) = state.oauth2[&provider].start();
    let session = OAuth2Session {
        csrf,
        nonce,
        origin: referer.to_string(),
    };

    let redis_key = state
        .redis
        .set_ex(constant::SESSION_PREFIX, &session)
        .await?;

    let mut cookie = Cookie::new(constant::OAUTH2_TEMPORARY, redis_key);
    cookie.set_http_only(true);
    cookie.set_same_site(Some(SameSite::None));
    cookie.set_secure(true);

    Ok((jar.add(cookie), Redirect::to(auth_url.as_ref())))
}
