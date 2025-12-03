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
    database::{self},
    error::{ApiError, ApiResult, ResultExt},
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
        (status = 400, description = "Bad request - validation failed or invalid data", body = ApiError),
        (status = 401, description = "Unauthorized - missing/invalid token", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn create(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Json(request): Json<Request>,
) -> ApiResult<String> {
    let token = bearer.token();
    let author_id = state.token.access.decode(token)?;

    let mut transaction = state.database.begin().await?;

    let database::post::Key { id, slug } = database::post::create(
        author_id,
        &request.title,
        &request.content,
        &mut *transaction,
    )
    .await
    .with_context(StatusCode::BAD_REQUEST, "Post with given title existed")?;

    database::tag::create(&request.tags, &mut *transaction)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid tags")?;
    database::post::add_tags(id, &request.tags, &mut *transaction)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid tags")?;

    transaction.commit().await?;

    Ok(slug)
}
