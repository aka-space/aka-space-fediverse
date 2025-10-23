pub mod account;
pub mod auth;
mod ping;

use std::sync::Arc;

use axum::{Router, routing};

use super::state::ApiState;

pub use ping::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(account::build())
}
