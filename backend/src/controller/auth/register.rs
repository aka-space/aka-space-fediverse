use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use axum_typed_multipart::{FieldData, TryFromMultipart, TypedMultipart};
use bytes::Bytes;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    config::CONFIG,
    database,
    error::{ApiError, ApiResult, OptionExt, ResultExt},
    state::ApiState,
};

#[derive(TryFromMultipart, Validate)]
pub struct Request {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 1))]
    pub username: String,

    #[form_data(limit = "20MiB")]
    pub avatar: Option<FieldData<Bytes>>,

    #[validate(length(min = 8))]
    pub password: String,
}

impl std::fmt::Debug for Request {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Request")
            .field("email", &self.email)
            .field("username", &self.username)
            .field("password", &self.password)
            .finish()
    }
}

#[allow(dead_code)]
#[derive(ToSchema)]
#[schema(as = auth::register::Request)]
pub struct RequestDoc {
    #[schema(example = "user@example.com")]
    pub email: String,

    #[schema(example = "someuser")]
    pub username: String,

    #[schema(format = "binary")]
    pub avatar: String,

    #[schema(example = "12345678")]
    pub password: String,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/register",
    request_body(
        content = RequestDoc,
        content_type = "multipart/form-data",
        description = "Register with multipart form (avatar optional)"
    ),
    responses(
        (
            status = 201,
            description = "Account created. Returns access token in body and sets refresh token cookie.",
            body = String,
            headers(
                ("Set-Cookie" = String)
            )
        ),
        (
            status = 400,
            description = "Invalid registration data",
            body = ApiError
        ),
        (
            status = 500,
            description = "Internal server error",
            body = ApiError
        )
    )
)]
#[tracing::instrument(err(Debug), skip(state, jar))]
pub async fn register(
    State(state): State<Arc<ApiState>>,
    jar: CookieJar,
    TypedMultipart(request): TypedMultipart<Request>,
) -> ApiResult<(StatusCode, CookieJar, String)> {
    request.validate()?;

    let hashed_password =
        bcrypt::hash_with_salt(&request.password, CONFIG.bcrypt.cost, CONFIG.bcrypt.salt)
            .with_context(StatusCode::BAD_REQUEST, "Invalid password")?;
    let avatar_path = match request.avatar {
        Some(avatar) => {
            let file_name = avatar
                .metadata
                .file_name
                .unwrap_or_else(|| "image.png".to_string());
            let (name, extension) = file_name
                .rsplit_once(".")
                .with_context(StatusCode::BAD_REQUEST, "Avatar must be an image")?;
            let key = format!("{}-{}.{}", name, Uuid::new_v4(), extension);
            let data = avatar.contents;
            let avatar_path = state.s3.upload(&key, data).await?;

            Some(avatar_path)
        }
        None => None,
    };

    let id = database::account::create(
        &request.email,
        &request.username,
        avatar_path.as_deref(),
        Some(&hashed_password.to_string()),
        &state.database,
    )
    .await
    .with_context(StatusCode::BAD_REQUEST, "Invalid register data")?;

    let (access, refresh) = state.token.encode(id)?;

    tracing::info!(access, ?refresh, ?id, "Token created");

    Ok((StatusCode::CREATED, jar.add(refresh), access))
}
