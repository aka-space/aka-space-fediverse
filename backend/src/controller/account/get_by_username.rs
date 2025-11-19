use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    database::{self, account::MinimalAccount},
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account/{username}",
    params(
        ("username" = String, Path, description = "Username of the account to fetch")
    ),
    responses(
        (status = 200, description = "Account with given username", body = MinimalAccount),
        (status = 400, description = "Account not found", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn get_by_username(
    State(state): State<Arc<ApiState>>,
    Path(username): Path<String>,
) -> Result<Json<MinimalAccount>> {
    match database::account::get_by_username(&username, &state.database).await {
        Ok(Some(account)) => Ok(Json(account)),
        Ok(None) => Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("No account with given email".to_string())
            .build()),
        Err(error) => {
            tracing::error!(?error, username, "Failed to get account with given email");

            Err(Error::internal())
        }
    }
}
