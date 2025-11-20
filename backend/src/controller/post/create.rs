use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    database,
    error::{Error, Result},
    state::ApiState,
};

#[derive(Debug, ToSchema, Deserialize, Validate)]
#[schema(as = auth::login::Request)]
#[schema(example = json!({
    "title": "My first post",
    "content": "This is the body of my post"
}))]
pub struct Request {
    #[validate(length(min = 1))]
    pub title: String,

    #[validate(length(min = 1))]
    pub content: String,
}

#[utoipa::path(
    post,
    tag = "Post",
    path = "/post",
    request_body = Request,
    security(("jwt_token" = [])),
    responses(
        (status = 201, description = "Post created. Returns slug of the created post.", body = String),
        (status = 400, description = "Bad request - validation failed or invalid data", body = Error),
        (status = 401, description = "Unauthorized - missing/invalid token", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Json(request): Json<Request>,
) -> Result<String> {
    let token = bearer.token();
    let author_id = state.token_service.access.decode(token)?;

    match database::post::create(author_id, &request.title, &request.content, &state.database).await
    {
        Ok(slug) => Ok(slug),
        Err(error) => {
            tracing::error!(?error, "Failed to create post");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Failed to create post".to_string())
                .build())
        }
    }
}
