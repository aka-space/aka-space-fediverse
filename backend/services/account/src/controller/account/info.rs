use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{
    database::account,
    error::{Error, Result},
    state::ApiState,
};

#[derive(Serialize, ToSchema)]
#[schema(as = account::info::Info)]
pub struct Info {
    pub email: String,
    pub username: String,
}

#[utoipa::path(post, tag = "Account", path = "/account/info")]
pub async fn info(state: State<Arc<ApiState>>, jar: CookieJar) -> Result<Json<Info>> {
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

    let info = Info {
        email: account.email,
        username: account.username,
    };

    Ok(Json(info))
}
