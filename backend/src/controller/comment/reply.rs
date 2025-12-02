use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    database,
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
};

#[derive(Debug, ToSchema, Deserialize, Validate)]
#[schema(as = post::comment::Request)]
#[schema(example = json!({
    "content": "This is my comment",
}))]
pub struct Request {
    #[validate(length(min = 1))]
    pub content: String,
}

#[utoipa::path(
    post,
    tag = "Comment",
    path = "/comment/{id}/reply",
    params(
        ("id" = Uuid, Path, description = "Comment id to reply to (UUID)", example = json!("3fa85f64-5717-4562-b3fc-2c963f66afa6"))
    ),
    request_body = Request,
    security(("jwt_token" = [])),
    responses(
        (status = 201, description = "Reply created; returns created reply id (UUID string)", body = String),
        (status = 400, description = "Invalid comment content or id", body = ApiError),
        (status = 401, description = "Unauthorized - missing/invalid token", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn reply(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> ApiResult<Json<Uuid>> {
    let token = bearer.token();
    let account_id = state.token_service.access.decode(token)?;

    let id = database::comment::reply(id, account_id, &request.content, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid comment content")?;

    Ok(Json(id))
}
