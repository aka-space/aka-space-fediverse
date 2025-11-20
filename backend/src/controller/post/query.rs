use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::Query;
use serde::Deserialize;

use crate::{
    controller::post::Post,
    database,
    error::{Error, Result},
    state::ApiState,
    util::{Paginated, Pagination, Sort, SortDirection},
};

#[derive(Deserialize)]
pub struct Request {
    query: Option<String>,

    #[serde(default)]
    tags: Vec<String>,

    author_name: Option<String>,

    #[serde(flatten)]
    sort: Sort<database::post::SortableColumn>,

    #[serde(flatten)]
    pagination: Pagination,
}

#[utoipa::path(
    get,
    tag = "Post",
    path = "/post",
    params(
        ("query" = Option<String>, Query, description = "Full-text query string"),
        ("tags" = Vec<String>, Query, description = "Filter by tags (repeatable)"),
        ("author_name" = Option<String>, Query, description = "Filter by author username"),
        ("column" = Option<database::post::SortableColumn>, Query, description = "Sort by column name"),
        ("direction" = Option<SortDirection>, Query, description = "Sort direction: asc or desc"),
        ("limit" = Option<u32>, Query, description = "number of items per page"),
        ("offset" = Option<u32>, Query, description = "offset (0-indexed)"),
    ),
    responses(
        (status = 200, description = "List of posts matching query", body = Vec<Post>),
        (status = 400, description = "Bad request / no posts found", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn query(
    State(state): State<Arc<ApiState>>,
    Query(mut request): Query<Request>,
) -> Result<Json<Paginated<Post>>> {
    let n = request.pagination.limit as usize;
    request.pagination.limit += 1;

    let raws = match database::post::query(
        request.query.as_deref(),
        request.tags.as_slice(),
        request.author_name.as_deref(),
        request.sort,
        request.pagination,
        &state.database,
    )
    .await
    {
        Ok(raw) => raw,
        Err(error) => {
            tracing::error!(?error, "Failed to get posts");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("no post found".to_string())
                .build());
        }
    };
    let has_next = raws.len() == n + 1;

    let mut posts = Vec::with_capacity(raws.len());
    for raw in raws.into_iter().take(n) {
        posts.push(Post::from_raw(raw, &state.database).await?);
    }

    Ok(Json(Paginated {
        has_next,
        data: posts,
    }))
}
