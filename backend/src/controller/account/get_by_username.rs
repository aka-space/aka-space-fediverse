use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    database::{self, account::MinimalAccount},
    error::{ApiError, ApiResult, OptionExt},
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
        (status = 400, description = "Account not found", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_by_username(
    State(state): State<Arc<ApiState>>,
    Path(username): Path<String>,
) -> ApiResult<Json<MinimalAccount>> {
    let opt_account = database::account::get_by_username(&username, &state.database).await?;
    let account =
        opt_account.with_context(StatusCode::BAD_REQUEST, "No account with given email")?;

    Ok(Json(account))
}
