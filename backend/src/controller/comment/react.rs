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
    error::{ApiResult, ResultExt},
    state::ApiState,
};

#[derive(Debug, ToSchema, Deserialize)]
#[schema(as = post::react::Request)]
pub struct Request {
    pub kind: Reaction,
}

#[utoipa::path(
    post,
    operation_id = "comment::react",
    tag = "Comment",
    path = "/comment/{id}/react",
    request_body = Request,
    security(("jwt_token" = [])),
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn react(
    State(state): State<Arc<ApiState>>,
    TypedHeader(bearer): TypedHeader<Authorization<Bearer>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> ApiResult<StatusCode> {
    let token = bearer.token();
    let author_id = state.token.access.decode(token)?;

    database::comment::react(id, author_id, request.kind, &state.database)
        .await
        .with_context(StatusCode::BAD_REQUEST, "Invalid comment id")?;

    Ok(StatusCode::NO_CONTENT)
}
