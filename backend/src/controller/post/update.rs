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
        (status = 400, description = "Invalid post id or content", body = Error),
        (status = 401, description = "Unauthorized - missing/invalid token", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn update(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<StatusCode> {
    let token = bearer.token();
    let author_id = state.token_service.access.decode(token)?;

    if let Err(error) =
        database::post::update(id, author_id, &request.content, &state.database).await
    {
        tracing::error!(?error, ?id, "Failed to update post");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid post id or content".to_string())
            .build());
    }

    Ok(StatusCode::NO_CONTENT)
}
