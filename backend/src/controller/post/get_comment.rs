use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_extra::extract::Query;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{self, account::MinimalAccount},
    error::{ApiError, ApiResult, OptionExt, ResultExt},
    state::ApiState,
    util::{self, Paginated, Pagination, Sort, SortDirection},
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

#[derive(Debug, Serialize, ToSchema)]
#[schema(example = json!({
    "id": "00000000-0000-0000-0000-000000000000",
    "account": { "email": "user@example.com", "username": "someuser" },
    "content": "This is a comment",
    "created_at": "2025-11-21T00:00:00Z",
    "updated_at": "2025-11-21T00:00:00Z"
}))]
pub struct Comment {
    pub id: Uuid,

    pub account: MinimalAccount,
    pub content: String,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Comment {
    pub async fn from_raw(
        raw: database::comment::Comment,
        database: &PgPool,
    ) -> ApiResult<Comment> {
        let opt_account = database::account::get(raw.account_id, database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "Comment's author is banned")?;
        let account =
            opt_account.with_context(StatusCode::BAD_REQUEST, "Comment's author is banned")?;

        Ok(Comment {
            id: raw.id,
            account: MinimalAccount {
                email: account.email,
                username: account.username,
            },
            content: raw.content,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
        })
    }
}

#[utoipa::path(
    get,
    tags = ["Post", "Comment"],
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
pub async fn get_comment(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Query(request): Query<Request>,
) -> ApiResult<Json<Paginated<Comment>>> {
    let limit = request.limit as usize + 1;

    let raws = database::comment::get_by_post(
        id,
        request.sort,
        Pagination {
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
