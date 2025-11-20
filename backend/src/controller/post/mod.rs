mod create;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/post", routing::post(create))
}
