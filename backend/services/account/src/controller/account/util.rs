use std::sync::Arc;

use axum::http::StatusCode;
use axum_extra::extract::CookieJar;

use crate::{
    database::account::{self, Account},
    error::{Error, Result},
    state::ApiState,
};

pub async fn get_account(state: Arc<ApiState>, jar: CookieJar) -> Result<Account> {
    let c = match cookie::get(cookie::TOKEN_KEY, jar) {
        Some(c) => c,
        None => {
            tracing::warn!("Try to get account information before login");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Missing cookie".into())
                .build());
        }
    };
    let token = c.value();

    let id = match state.jwt.decode(token) {
        Ok(id) => id,
        Err(error) => {
            tracing::error!(?error, "Invalid cookie");

            return Err(Error::builder().status(StatusCode::UNAUTHORIZED).build());
        }
    };

    let account = match account::get(id, &state.database_pool).await {
        Ok(Some(account)) => account,
        Ok(None) => {
            tracing::warn!(?id, "No account with given id",);

            return Err(Error::internal());
        }
        Err(error) => {
            tracing::warn!(?error, "Failed to fetch account");

            return Err(Error::internal());
        }
    };

    Ok(account)
}
