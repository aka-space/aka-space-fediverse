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
    error::{ApiResult, Context, ResultExt},
    state::ApiState,
};

#[derive(Debug, ToSchema, Deserialize, Validate)]
#[schema(as = comment::update::Request)]
#[schema(example = json!({
    "content": "This is updated comment",
}))]
pub struct Request {
    #[validate(length(min = 1))]
    pub content: String,
}

#[utoipa::path(
    put,
    tag = "Comment",
    path = "/comment/{id}",
    request_body = Request,
    params(
        ("id" = Uuid, Path, description = "Comment id to update"),
    ),
    security(("jwt_token" = [])),
    responses(
        (status = 204, description = "Comment updated successfully, no content returned"),
        (status = 400, description = "Invalid comment id or content", body = Context),
        (status = 401, description = "Unauthorized - missing/invalid token", body = Context),
        (status = 500, description = "Internal server error", body = Context)
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
    let account_id = state.token.access.decode(token)?;

    database::comment::update(id, account_id, request.content.as_str(), &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid comment id or content")?;

    Ok(StatusCode::NO_CONTENT)
}
