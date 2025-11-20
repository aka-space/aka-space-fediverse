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
    database::{self, post::PostKey},
    error::{Error, Result},
    state::ApiState,
};

#[derive(Debug, ToSchema, Deserialize, Validate)]
#[schema(as = post::create::Request)]
#[schema(example = json!({
    "title": "My first post",
    "content": "This is the body of my post",
    "tags": ["rust", "axum"]
}))]
pub struct Request {
    #[validate(length(min = 1))]
    pub title: String,

    #[validate(length(min = 1))]
    pub content: String,

    #[validate(length(min = 1))]
    pub tags: Vec<String>,
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

    let mut transaction = match state.database.begin().await {
        Ok(transaction) => transaction,
        Err(error) => {
            tracing::error!(?error, "Failed to create database transaction");

            return Err(Error::internal());
        }
    };

    let PostKey { id, slug } = match database::post::create(
        author_id,
        &request.title,
        &request.content,
        &mut *transaction,
    )
    .await
    {
        Ok(key) => key,
        Err(error) => {
            tracing::error!(?error, "Failed to create post");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Post with given title existed".to_string())
                .build());
        }
    };

    if let Err(error) = database::tag::create(&request.tags, &mut *transaction).await {
        tracing::error!(?error, "Failed to insert tags");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid tags".to_string())
            .build());
    }

    if let Err(error) = database::post::add_tags(id, &request.tags, &mut *transaction).await {
        tracing::error!(?error, "Failed to add tags to post");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid tags".to_string())
            .build());
    }

    if let Err(error) = transaction.commit().await {
        tracing::error!(?error, "Failed to commit transaction");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Failed to create post".to_string())
            .build());
    }

    Ok(slug)
}
