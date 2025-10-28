use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use serde::Serialize;
use utoipa::ToSchema;

use crate::{
    database,
    error::{Error, Result},
    state::ApiState,
};

#[derive(Serialize, ToSchema)]
#[schema(example = json!({
    "email": "user@example.com",
    "username": "user"
}))]
#[schema(as = auth::me::Account)]
pub struct Account {
    pub email: String,
    pub username: String,
}

#[axum::debug_handler]
#[utoipa::path(
    get,
    tag = "Auth",
    path = "/auth/me",
    security(("jwt_token" = [])),
    responses(
        (status = 200, description = "Return current authenticated account", body = Account),
        (status = 401, description = "Unauthorized - missing/invalid/expired token", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn me(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
) -> Result<Json<Account>> {
    let token = bearer.token();
    let id = state.token_service.access.decode(token)?;

    match database::account::get(id, &state.database).await {
        Ok(Some(raw)) => Ok(Json(Account {
            email: raw.email,
            username: raw.username,
        })),
        Ok(None) => {
            tracing::warn!(?id, "No account with given id",);

            Err(Error::internal())
        }
        Err(error) => {
            tracing::warn!(?error, "Failed to fetch account");

            Err(Error::internal())
        }
    }
}
