use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use uuid::Uuid;

use crate::{
    controller::comment::Comment,
    database,
    error::{ApiError, ApiResult},
    state::ApiState,
};

#[utoipa::path(
    get,
    operation_id = "comment::get_child",
    tag = "Comment",
    path = "/comment/{id}/child",
    params(
        ("id" = Uuid, Path, description = "Parent comment id (UUID)", example = json!("3fa85f64-5717-4562-b3fc-2c963f66afa6"))
    ),
    responses(
        (status = 200, description = "List of child comments", body = Vec<Comment >),
        (status = 400, description = "Invalid comment id", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_child(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> ApiResult<Json<Vec<Comment>>> {
    let raws = database::comment::get_child(id, &state.database).await?;

    let mut comments = Vec::with_capacity(raws.len());
    for raw in raws {
        comments.push(Comment::from_raw(raw, &state.database).await?);
    }

    Ok(Json(comments))
}
