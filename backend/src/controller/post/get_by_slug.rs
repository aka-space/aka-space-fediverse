use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    controller::post::Post,
    database,
    error::{ApiError, ApiResult, OptionExt, ResultExt},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Post",
    path = "/post/{slug}",
    params(
        ("slug" = String, description = "Post slug (path parameter)"),
    ),
    responses(
        (status = 200, description = "Post found", body = Post),
        (status = 400, description = "Bad request / No post found", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_by_slug(
    State(state): State<Arc<ApiState>>,
    Path(slug): Path<String>,
) -> ApiResult<Json<Post>> {
    let opt_raw = database::post::get_by_slug(&slug, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "No post according to given slug")?;
    let raw = opt_raw.with_context(StatusCode::BAD_REQUEST, "No post according to given slug")?;

    Post::from_raw(raw, &state.database).await.map(Json)
}
