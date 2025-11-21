mod get_by_username;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use get_by_username::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/account/{username}", routing::get(get_by_username))
}
