use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use axum_extra::extract::CookieJar;
use broadcast::queue::account::{Data, Event};
use uuid::Uuid;

use crate::{
    controller::account::util,
    database::account::{self, Role},
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(delete, tag = "Account", path = "/account/{id}")]
pub async fn delete(
    State(state): State<Arc<ApiState>>,
    jar: CookieJar,
    Path(id): Path<Uuid>,
) -> Result<()> {
    let account = util::get_account(state.clone(), jar).await?;
    if account.role != Role::Admin {
        tracing::error!(?account, "Unauthorized for account deletion");

        return Err(Error::builder().status(StatusCode::UNAUTHORIZED).build());
    }

    if let Err(error) = account::delete(id, &state.database_pool).await {
        tracing::error!(?error, "Failed to delete account");

        return Err(Error::internal());
    }

    if let Err(error) = state
        .account_sender
        .send(&Event::Create, &Data { id })
        .await
    {
        tracing::error!(?error, ?id, "Failed to send delete account event to queue");
    }

    Ok(())
}
