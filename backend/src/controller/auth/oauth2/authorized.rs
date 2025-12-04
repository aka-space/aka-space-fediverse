use std::sync::Arc;

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Redirect,
};
use axum_extra::extract::CookieJar;
use openidconnect::{AuthorizationCode, CsrfToken};
use serde::Deserialize;

use crate::{
    config::Provider,
    constant,
    controller::auth::oauth2::OAuth2Session,
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
        .get(constant::OAUTH2_TEMPORARY)
        .with_context(StatusCode::UNAUTHORIZED, "Invalid call to oauth2 api")?;

    let session = state
        .redis
        .get::<OAuth2Session>(cookie.value())
        .await?
        .with_context(StatusCode::UNAUTHORIZED, "Invalid call to oauth2 api")?;

    let claims = state.oauth2[&provider]
        .exchange(
            AuthorizationCode::new(query.code),
            CsrfToken::new(query.state),
            session.csrf,
            session.nonce,
        )
        .await?;

    tracing::info!(?claims);

    let email = claims.email().expect("Account must have email").as_str();
    let (username, _) = email.split_once('@').expect("Email must be valid");
    let avatar_url = claims
        .picture()
        .and_then(|x| x.get(None))
        .map(|x| x.as_str());

    let opt_account = database::account::get_by_email(email, &state.database).await?;
    let id = match opt_account {
        Some(account) => account.id,
        None => {
            database::account::create(email, username, avatar_url, None, &state.database).await?
        }
    };

    let (access, refresh) = state.token.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((jar.add(refresh), Redirect::to(&session.origin)))
}
