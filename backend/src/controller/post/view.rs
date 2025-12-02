use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use axum_extra::{
    TypedHeader,
    headers::{Authorization, authorization::Bearer},
};
use hmac::{Hmac, Mac};
use rand::distr::{Alphanumeric, SampleString};
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
    tag = "Post",
    path = "/post/{id}/view",
    params(
        ("id" = Uuid, Path, description = "Post ID"),
    ),
    responses(
        (status = 204, description = "View count increased successfully"),
        (status = 400, description = "Invalid post id", body = ApiError),
    )
)]
#[tracing::instrument(err(Debug), skip(state))]
pub async fn view(
    State(state): State<Arc<ApiState>>,
    bearer: Option<TypedHeader<Authorization<Bearer>>>,
    Path(id): Path<Uuid>,
) -> ApiResult<StatusCode> {
    let viewer = match bearer {
        Some(TypedHeader(bearer)) => {
            let token = bearer.token();
            state.token_service.access.decode(token)?.to_string()
        }
        None => Alphanumeric.sample_string(&mut rand::rng(), constant::RANDOM_SIZE),
    };

    let mut mac = Hmac::<Sha256>::new_from_slice(CONFIG.sha256_secret.as_bytes())?;
    mac.update(viewer.as_bytes());
    let viewer = mac.finalize().into_bytes();
    let viewer = hex::encode(viewer);

    state
        .redis_service
        .pfadd(constant::POST_PREFIX, &id.to_string(), viewer.as_bytes())
        .await?;

    Ok(StatusCode::NO_CONTENT)
}
