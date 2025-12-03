use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    database,
    error::{ApiResult, Context},
    state::ApiState,
};

#[utoipa::path(
    get,
    operation_id = "tag::get_all",
    tag = "Tag",
    path = "/tag",
    responses(
        (status = 200, description = "List of tag names", body = Vec<String>),
        (status = 500, description = "Internal server error", body = Context)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_all(State(state): State<Arc<ApiState>>) -> ApiResult<Json<Vec<String>>> {
    let tags = database::tag::get_all(&state.database).await?;

    Ok(Json(tags))
}
