use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::Query;
use serde::Deserialize;

use crate::{
    controller::post::Post,
    database,
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
    util::{self, Paginated, Pagination, Sort, SortDirection},
};

#[derive(Debug, Deserialize)]
pub struct Request {
    pub query: Option<String>,

    #[serde(default)]
    pub tags: Vec<String>,

    pub author_name: Option<String>,

    #[serde(flatten)]
    pub sort: Sort<database::post::SortableColumn>,

    #[serde(default = "util::default_limit")]
    pub limit: u64,

    #[serde(default = "util::default_offset")]
    pub offset: u64,
}

#[utoipa::path(
    get,
    tag = "Post",
    path = "/post",
    params(
        ("query" = Option<String>, Query, description = "Full-text query string"),
        ("tags" = Option<Vec<String>>, Query, description = "Filter by tags (repeatable)"),
        ("author_name" = Option<String>, Query, description = "Filter by author username"),
        ("column" = Option<database::post::SortableColumn>, Query, description = "Sort by column name"),
        ("direction" = Option<SortDirection>, Query, description = "Sort direction: asc or desc"),
        ("limit" = Option<u32>, Query, description = "number of items per page"),
        ("offset" = Option<u32>, Query, description = "offset (0-indexed)"),
    ),
    responses(
        (status = 200, description = "List of posts matching query", body = Paginated<Post>),
        (status = 400, description = "Bad request / no posts found", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn query(
    State(state): State<Arc<ApiState>>,
    Query(request): Query<Request>,
) -> ApiResult<Json<Paginated<Post>>> {
    let limit = request.limit as usize + 1;

    let raws = database::post::query(
        request.query.as_deref(),
        request.tags.as_slice(),
        request.author_name.as_deref(),
        request.sort,
        Pagination {
            limit: limit as u64,
            offset: request.offset,
        },
        &state.database,
    )
    .await
    .with_context(StatusCode::BAD_REQUEST, "No post found")?;

    let has_next = raws.len() == limit;

    let mut posts = Vec::with_capacity(raws.len());
    for raw in raws.into_iter().take(limit - 1) {
        posts.push(Post::from_raw(raw, &state.database).await?);
    }

    Ok(Json(Paginated {
        has_next,
        data: posts,
    }))
}
