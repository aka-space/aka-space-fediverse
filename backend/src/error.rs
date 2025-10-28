use axum::{Json, http::StatusCode, response::IntoResponse};
use bon::Builder;
use serde::Serialize;
use serde_json::Value;
use utoipa::ToSchema;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error, Builder, Serialize, ToSchema)]
#[error("{:#?}", self)]
pub struct Error {
    #[serde(skip)]
    pub status: StatusCode,
    pub message: Option<String>,
    pub detail: Option<Value>,
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        (self.status, Json(self)).into_response()
    }
}

impl Error {
    pub fn internal() -> Error {
        Error::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .build()
    }
}

impl From<validator::ValidationErrors> for Error {
    fn from(error: validator::ValidationErrors) -> Self {
        Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .detail(serde_json::to_value(error.0).unwrap())
            .build()
    }
}
