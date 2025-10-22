mod config;
mod controller;
mod doc;
mod error;
mod state;

use std::net::SocketAddr;

use axum::Router;
use state::ApiState;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::config::CONFIG;

async fn build_app() -> Router {
    let state = ApiState::new().await;

    Router::new()
        .merge(controller::build())
        .merge(doc::build())
        .layer(TraceLayer::new_for_http())
        .layer(cors::new(&CONFIG.cors_origin).unwrap())
        .with_state(state)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .pretty()
        .with_timer(tracing_subscriber::fmt::time::ChronoLocal::rfc_3339())
        .init();

    let app = build_app().await;

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port))
        .await
        .unwrap();

    tracing::info!("Listening on port {}", CONFIG.port);

    axum::serve(listener, app).await.unwrap();
}
