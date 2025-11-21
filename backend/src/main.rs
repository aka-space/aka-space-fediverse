mod config;
mod controller;
mod database;
mod doc;
mod error;
mod middleware;
mod service;
mod state;
mod util;

use std::net::SocketAddr;

use axum::Router;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::{config::CONFIG, state::ApiState};

async fn build_app() -> Router {
    let state = ApiState::new().await;

    Router::new()
        .merge(controller::build())
        .merge(doc::build())
        .layer(TraceLayer::new_for_http())
        .layer(middleware::cors(&CONFIG.cors.origin))
        .layer(axum_tracing_opentelemetry::middleware::OtelAxumLayer::default())
        .layer(axum_tracing_opentelemetry::middleware::OtelInResponseLayer)
        .with_state(state)
}

#[tokio::main]
async fn main() {
    let _guard = init_tracing_opentelemetry::TracingConfig::development()
        .with_log_directives("debug")
        .init_subscriber()
        .unwrap();

    let app = build_app().await;

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port))
        .await
        .unwrap();

    tracing::info!("Listening on port {}", CONFIG.port);

    axum::serve(listener, app).await.unwrap();
}
