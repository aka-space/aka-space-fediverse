use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_extra::extract::Query;
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    controller::comment::Comment,
    database,
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
    util::{self, Paginated, SimplePagination, Sort, SortDirection},
};

#[derive(Debug, Deserialize)]
pub struct Request {
    #[serde(flatten)]
    pub sort: Sort<database::comment::SortableColumn>,

    #[serde(default = "util::default_limit")]
    pub limit: u64,

    #[serde(default = "util::default_offset")]
    pub offset: u64,
}

#[utoipa::path(
    get,
    tag = "Comment",
    path = "/post/{id}/comment",
    params(
        ("id" = Uuid, Path, description = "Post id"),
        ("column" = Option<database::comment::SortableColumn>, Query, description = "Sort column"),
        ("direction" = Option<SortDirection>, Query, description = "Sort direction (asc|desc)"),
        ("limit" = Option<u64>, Query, description = "number of items requested (server may return limit+1 to indicate next)"),
        ("offset" = Option<u64>, Query, description = "offset (0-indexed)"),
    ),
    responses(
        (status = 200, description = "List comments for a post (paginated)", body = Paginated<Comment>),
        (status = 400, description = "Bad request / no comments found", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_by_post(
    State(state): State<Arc<ApiState>>,
    Path(post_id): Path<Uuid>,
    Query(request): Query<Request>,
) -> ApiResult<Json<Paginated<Comment>>> {
    let limit = request.limit as usize + 1;

    let raws = database::comment::get_by_post(
        post_id,
        request.sort,
        SimplePagination {
            limit: limit as u64,
            offset: request.offset,
        },
        &state.database,
    )
    .await
    .with_context(StatusCode::BAD_REQUEST, "No comment found")?;
    let has_next = raws.len() == limit;

    let mut comments = Vec::with_capacity(raws.len());
    for raw in raws.into_iter().take(limit - 1) {
        comments.push(Comment::from_raw(raw, &state.database).await?);
    }

    Ok(Json(Paginated {
        has_next,
        data: comments,
    }))
}
