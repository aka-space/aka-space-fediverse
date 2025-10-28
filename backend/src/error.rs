
use axum::{Json, http::StatusCode, response::IntoResponse};
use bon::Builder;
use serde::Serialize;
use serde_json::Value;
use utoipa::ToSchema;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error, Builder)]
#[error("{:#?}", self)]
pub struct Error {
    pub status: StatusCode,
    pub message: Option<String>,
    pub detail: Option<Value>,
}

#[derive(Serialize, ToSchema)]
pub struct ErrorResponse {
    pub message: Option<String>,
    pub details: Option<Value>,
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        (
            self.status,
            Json(ErrorResponse {
                message: self.message,
                details: self.detail,
            }),
        )
            .into_response()
    }
}

impl Error {
    pub fn internal() -> Error {
        Error::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .build()
    }
}
