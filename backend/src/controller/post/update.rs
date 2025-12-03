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
#[schema(as = post::update::Request)]
#[schema(example = json!({
    "content": "This is updated content",
}))]
pub struct Request {
    #[validate(length(min = 1))]
    pub content: String,
}

#[utoipa::path(
    put,
    tag = "Post",
    path = "/post/{id}",
    params(
        ("id" = Uuid, description = "Post id (UUID)", example = json!("3fa85f64-5717-4562-b3fc-2c963f66afa6"))
    ),
    request_body = Request,
    security(("jwt_token" = [])),
    responses(
        (status = 204, description = "Post updated successfully. No content returned."),
        (status = 400, description = "Invalid post id or content", body = ApiError),
        (status = 401, description = "Unauthorized - missing/invalid token", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn update(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> ApiResult<StatusCode> {
    let token = bearer.token();
    let author_id = state.token.access.decode(token)?;

    database::post::update(id, author_id, &request.content, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid post id or content")?;

    Ok(StatusCode::NO_CONTENT)
}
