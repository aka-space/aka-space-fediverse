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
    error::{ApiResult, ResultExt},
    state::ApiState,
    util::{CursorPagination, Paginated},
};

#[utoipa::path(get, tag = "Comment", path = "/post/{id}/comment")]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn get_by_post(
    State(state): State<Arc<ApiState>>,
    Path(post_id): Path<Uuid>,
    Query(pagination): Query<CursorPagination>,
) -> ApiResult<Json<Paginated<Comment>>> {
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
