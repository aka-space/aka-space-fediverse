mod login;
mod logout;
mod register;
mod me;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use login::*;
pub use logout::*;
pub use register::*;
pub use me::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/auth/register", routing::post(register))
        .route("/auth/login", routing::post(login))
        .route("/auth/me", routing::get(me))
        .route("/auth/logout", routing::post(logout))
}
