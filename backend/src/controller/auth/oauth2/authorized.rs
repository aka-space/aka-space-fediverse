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
    error::{Error, Result},
    state::ApiState,
};

#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub code: String,
    pub state: String,
}

pub async fn authorized(
    State(state): State<Arc<ApiState>>,
    jar: CookieJar,
    Path(provider): Path<Provider>,
    Query(query): Query<AuthRequest>,
) -> Result<(CookieJar, Redirect)> {
    let Some(cookie) = jar.get(OAUTH2_TEMPORARY) else {
        tracing::warn!("No cookie found");

        return Err(Error::builder()
            .status(StatusCode::UNAUTHORIZED)
            .message("Invalid call to oauth2 api".into())
            .build());
    };

    let Some((csrf, nonce)): Option<(CsrfToken, Nonce)> =
        state.redis_service.get(cookie.value()).await?
    else {
        tracing::warn!(key = ?cookie.value(),"Key not found");

        return Err(Error::builder()
            .status(StatusCode::UNAUTHORIZED)
            .message("Invalid call to oauth2 api".into())
            .build());
    };

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

    let opt_account = match database::account::get_by_email(email, &state.database).await {
        Ok(opt_account) => opt_account,
        Err(error) => {
            tracing::error!(?error, "Failed to get account");

            return Err(Error::internal());
        }
    };

    let id = match opt_account {
        Some(account) => account.id,
        None => match database::account::create(email, email, None, &state.database).await {
            Ok(id) => id,
            Err(error) => {
                tracing::error!(?error, "Failed to create account");

                return Err(Error::internal());
            }
        },
    };

    let (access, refresh) = state.token_service.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((jar.add(refresh), Redirect::to(&CONFIG.frontend_url)))
}
