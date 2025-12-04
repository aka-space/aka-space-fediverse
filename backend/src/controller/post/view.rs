use std::{net::SocketAddr, sync::Arc};

use axum::{
    body::Body,
    extract::{ConnectInfo, Path, State},
    http::StatusCode,
};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use uuid::Uuid;

use crate::{
    config::CONFIG,
    constant,
    error::{ApiError, ApiResult},
    state::ApiState,
};

#[utoipa::path(
    post,
    operation_id = "post::view",
    tag = "Post",
    path = "/post/{id}/view",
    params(
        ("id" = Uuid, Path, description = "Post ID"),
    ),
    security(("jwt_token" = [])),
    responses(
        (status = 204, description = "View count increased successfully"),
        (status = 400, description = "Invalid post id", body = ApiError),
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn view(
    State(state): State<Arc<ApiState>>,
    bearer: Option<TypedHeader<Authorization<Bearer>>>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Path(id): Path<Uuid>,
    req: axum::http::Request<Body>,
) -> ApiResult<StatusCode> {
    let viewer = match bearer {
        Some(TypedHeader(bearer)) => {
            let token = bearer.token();
            state.token.access.decode(token)?.to_string()
        }
        None => req
            .headers()
            .get("x-forwarded-for")
            .and_then(|hv| hv.to_str().ok())
            .and_then(|s| s.split(',').next().map(|first| first.trim().to_string()))
            .unwrap_or(peer.ip().to_string()),
    };

    let mut mac = Hmac::<Sha256>::new_from_slice(CONFIG.sha256_secret.as_bytes())?;
    mac.update(viewer.as_bytes());
    let viewer = mac.finalize().into_bytes();
    let viewer = hex::encode(viewer);

    state
        .redis
        .pfadd(constant::POST_PREFIX, &id.to_string(), viewer.as_bytes())
        .await?;

    Ok(StatusCode::NO_CONTENT)
}
