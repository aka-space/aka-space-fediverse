use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_extra::extract::Query;
use base64::{Engine, engine::general_purpose};
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::{
    controller::comment::Comment,
    database,
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
    util::{CursorPaginated, CursorPagination},
};

#[utoipa::path(
    get,
    operation_id = "comment::get_by_post",
    tag = "Comment",
    path = "/post/{id}/comment",
    params(
        ("id" = Uuid, Path, description = "Post id (UUID)", example = json!("3fa85f64-5717-4562-b3fc-2c963f66afa6")),
    ),
    params(
        ("cursor" = Option<String>, Query, description = "Cursor for pagination (opaque base64 string)"),
        ("limit" = Option<u32>, Query, description = "Number of items to return"),
    ),
    responses(
        (status = 200, description = "Paginated comments for the post", body = CursorPaginated<Comment>),
        (status = 400, description = "Bad request / no comments found", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_by_post(
    State(state): State<Arc<ApiState>>,
    Path(post_id): Path<Uuid>,
    Query(pagination): Query<CursorPagination>,
) -> ApiResult<Json<CursorPaginated<Comment>>> {
    let limit = pagination.limit as usize + 1;

    let raw = pagination.cursor.and_then(|cursor| decode_cursor(&cursor));
    let (last_ts, last_id) = match raw {
        Some((ts, id)) => (Some(ts), Some(id)),
        None => (None, None),
    };

    let raws =
        database::comment::get_by_post(post_id, limit as i64, last_ts, last_id, &state.database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "No comment found")?;
    let next_cursor = if raws.len() == limit {
        Some(encode_cursor(
            raws[limit - 2].created_at,
            raws[limit - 2].id,
        ))
    } else {
        None
    };

    let mut comments = Vec::with_capacity(raws.len());
    for raw in raws.into_iter().take(limit - 1) {
        comments.push(Comment::from_raw(raw, &state.database).await?);
    }

    Ok(Json(CursorPaginated {
        next_cursor,
        data: comments,
    }))
}

fn encode_cursor(ts: DateTime<Utc>, id: Uuid) -> String {
    general_purpose::STANDARD.encode(format!("{}|{}", ts, id))
}

fn decode_cursor(cursor: &str) -> Option<(DateTime<Utc>, Uuid)> {
    let bytes = general_purpose::STANDARD.decode(cursor).ok()?;
    let s = String::from_utf8(bytes).ok()?;
    let (ts, id) = s.split_once('|')?;
    let ts = ts.parse::<DateTime<Utc>>().ok()?;
    let id = id.parse::<Uuid>().ok()?;
    Some((ts, id))
}
