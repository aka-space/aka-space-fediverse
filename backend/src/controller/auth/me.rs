use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use serde::Serialize;
use utoipa::ToSchema;

use crate::{
    database,
    error::{ApiError, ApiResult, OptionExt, ResultExt},
    state::ApiState,
};

#[derive(Serialize, ToSchema)]
#[schema(example = json!({
    "email": "user@example.com",
    "username": "user",
    "avatar_path": "http://example.png"
}))]
#[schema(as = auth::me::Account)]
pub struct Account {
    pub email: String,
    pub username: String,
    pub avatar_path: Option<String>,
}

#[axum::debug_handler]
#[utoipa::path(
    get,
    tag = "Auth",
    path = "/auth/me",
    security(("jwt_token" = [])),
    responses(
        (status = 200, description = "Return current authenticated account", body = Account),
        (status = 401, description = "Unauthorized - missing/invalid/expired token", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn me(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> ApiResult<Json<Account>> {
    let token = bearer.token();
    let id = state.token_service.access.decode(token)?;

    let opt_account = database::account::get(id, &state.database)
        .await
        .with_context(StatusCode::FORBIDDEN, "Invalid account")?;
    let account = opt_account.with_context(StatusCode::FORBIDDEN, "Invalid account")?;

    Ok(Json(Account {
        email: account.email,
        username: account.username,
        avatar_path: account.avatar_path,
    }))
}
