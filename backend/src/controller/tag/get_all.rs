use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database,
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Tag",
    path = "/tag",
    responses(
        (status = 200, description = "List of tag names", body = Vec<String>),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> Result<Json<Vec<String>>> {
    match database::tag::get_all(&state.database).await {
        Ok(tags) => Ok(Json(tags)),
        Err(error) => {
            tracing::error!(?error, "Failed to get all tags");

            Err(Error::internal())
        }
    }
}
