mod react;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use react::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/comment/{id}", routing::put(update))
        .route("/comment/{id}/react", routing::post(react::react))
}
