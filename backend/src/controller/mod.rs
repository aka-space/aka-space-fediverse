pub mod account;
pub mod auth;
pub mod comment;
mod ping;
pub mod post;
pub mod tag;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use ping::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(account::build())
        .merge(auth::build())
        .merge(comment::build())
        .merge(post::build())
        .merge(tag::build())
}
