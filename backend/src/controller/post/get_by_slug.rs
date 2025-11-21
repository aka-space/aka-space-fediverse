use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};

use crate::{
    controller::post::Post,
    database,
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Post",
    path = "/post/{slug}",
    params(
        ("slug" = String, description = "Post slug (path parameter)"),
    ),
    responses(
        (status = 200, description = "Post found", body = Post),
        (status = 400, description = "Bad request / No post found", body = Error),
        (status = 500, description = "Internal server error", body = Error)
    )
)]
pub async fn get_by_slug(
    State(state): State<Arc<ApiState>>,
    Path(slug): Path<String>,
) -> Result<Json<Post>> {
    let raw = match database::post::get_by_slug(&slug, &state.database).await {
        Ok(Some(raw)) => raw,
        Ok(None) => {
            tracing::error!("No post according to given slug");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("No post according to given slug".to_string())
                .build());
        }
        Err(error) => {
            tracing::error!(?error, "Failed to get post data");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("No post according to given slug".to_string())
                .build());
        }
    };

    Post::from_raw(raw, &state.database).await.map(Json)
}
