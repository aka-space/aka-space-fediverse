mod get_all;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use get_all::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/tag", routing::get(get_all))
}
