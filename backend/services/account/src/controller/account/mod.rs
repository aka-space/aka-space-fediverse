mod delete;
mod info;
mod util;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use delete::*;
pub use info::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/account/info", routing::post(info))
        .route("/account/{id}", routing::delete(delete))
}
