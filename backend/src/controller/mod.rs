pub mod auth;
mod ping;
pub mod tag;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use ping::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(tag::build())
}
