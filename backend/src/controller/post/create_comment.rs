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
    error::{Error, Result},
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
    tags = ["Post", "Comment"],
    path = "/post/{id}/comment",
    request_body = Request,
    params(
        ("id" = Uuid, Path, description = "Post id to comment on"),
    ),
    security(("jwt_token" = [])),
    responses(
        (status = 201, description = "Comment created; returns created comment id (UUID string)", body = String),
        (status = 400, description = "Invalid comment content", body = Error),
        (status = 401, description = "Unauthorized - missing/invalid token", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn create_comment(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let token = bearer.token();
    let account_id = state.token_service.access.decode(token)?;

    match database::comment::create(id, account_id, &request.content, &state.database).await {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create comment");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid comment content".to_string())
                .build())
        }
    }
}
