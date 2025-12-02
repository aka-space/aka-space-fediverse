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

use crate::{
    database::{self, reaction::Reaction},
    error::{ApiError, ApiResult, ResultExt},
    state::ApiState,
};

#[derive(Debug, ToSchema, Deserialize)]
#[schema(as = post::react::Request)]
pub struct Request {
    pub kind: Reaction,
}

#[utoipa::path(
    post,
    tag = "Post",
    path = "/post/{id}/react",
    params(
        ("id" = Uuid, Path, description = "Post id (UUID)", example = json!("3fa85f64-5717-4562-b3fc-2c963f66afa6"))
    ),
    request_body = Request,
    security(("jwt_token" = [])),
    responses(
        (status = 204, description = "Reaction recorded / toggled successfully"),
        (status = 400, description = "Invalid post id or request", body = ApiError),
        (status = 401, description = "Unauthorized - missing/invalid token", body = ApiError),
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn react(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> ApiResult<StatusCode> {
    let token = bearer.token();
    let author_id = state.token_service.access.decode(token)?;

    database::reaction::react(id, author_id, request.kind, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid post id")?;

    Ok(StatusCode::NO_CONTENT)
}
