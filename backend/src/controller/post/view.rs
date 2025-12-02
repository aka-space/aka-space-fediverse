use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::{
    database,
    error::{ApiResult, ResultExt},
    state::ApiState,
};

#[utoipa::path(
    post,
    tag = "Post",
    path = "/post/{id}/view",
    params(
        ("id" = Uuid, description = "Post id (UUID)", example = json!("3fa85f64-5717-4562-b3fc-2c963f66afa6"))
    ),
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn view(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> ApiResult<StatusCode> {
    database::post::increase_view(id, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid post id")?;

    Ok(StatusCode::NO_CONTENT)
}
