use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use uuid::Uuid;

use crate::{
    database,
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
};

#[utoipa::path(
    post,
    tag = "Post",
    path = "/post/{id}/view",
    params(
        ("id" = Uuid, Path, description = "Post ID"),
    ),
    responses(
        (status = 204, description = "View count increased successfully"),
        (status = 400, description = "Invalid post id", body = ApiError),
    )
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
