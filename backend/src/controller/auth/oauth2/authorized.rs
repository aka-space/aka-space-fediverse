use std::sync::Arc;

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Redirect,
};
use axum_extra::extract::CookieJar;
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;

use crate::{
    config::{CONFIG, OAUTH2_TEMPORARY, Provider},
    database,
    error::{ApiResult, OptionExt},
    state::ApiState,
};

#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub code: String,
    pub state: String,
}

#[tracing::instrument(err(Debug), skip(state, jar))]
pub async fn authorized(
    State(state): State<Arc<ApiState>>,
    jar: CookieJar,
    Path(provider): Path<Provider>,
    Query(query): Query<AuthRequest>,
) -> ApiResult<(CookieJar, Redirect)> {
    let cookie = jar
        .get(OAUTH2_TEMPORARY)
        .with_context(StatusCode::UNAUTHORIZED, "Invalid call to oauth2 api")?;

    let (csrf, nonce) = state
        .redis_service
        .get::<(CsrfToken, Nonce)>(cookie.value())
        .await?
        .with_context(StatusCode::UNAUTHORIZED, "Invalid call to oauth2 api")?;

    let claims = state.oauth2_services[&provider]
        .exchange(
            AuthorizationCode::new(query.code),
            CsrfToken::new(query.state),
            csrf,
            nonce,
        )
        .await?;

    tracing::info!(?claims);

    let email = claims.email().expect("Account must have email").as_str();

    let opt_account = database::account::get_by_email(email, &state.database).await?;
    let id = match opt_account {
        Some(account) => account.id,
        None => database::account::create(email, email, None, &state.database).await?,
    };

    let (access, refresh) = state.token_service.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((jar.add(refresh), Redirect::to(&CONFIG.frontend_url)))
}
