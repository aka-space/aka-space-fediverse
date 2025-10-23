mod info;
mod delete;
mod util;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use info::*;
pub use delete::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/account/info", routing::post(info))
        .route("/account/{id}", routing::delete(delete))
}
