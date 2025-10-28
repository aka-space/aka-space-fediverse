mod login;
mod logout;
mod me;
pub mod oauth2;
mod refresh;
mod register;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use login::*;
pub use logout::*;
pub use me::*;
pub use refresh::*;
pub use register::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/auth/register", routing::post(register))
        .route("/auth/login", routing::post(login))
        .route("/auth/me", routing::get(me))
        .route("/auth/refresh", routing::post(refresh))
        .route("/auth/logout", routing::post(logout))
        .route("/oauth2/{provider}", routing::get(oauth2::start))
}
