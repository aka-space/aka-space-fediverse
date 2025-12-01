mod config;
mod controller;
mod database;
mod doc;
mod error;
mod middleware;
mod service;
mod state;
pub mod trace;
mod util;

use std::net::SocketAddr;

use axum::Router;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::{config::CONFIG, error::ApiResult, state::ApiState};

async fn build() -> ApiResult<Router> {
    let state = ApiState::new().await?;

    Ok(Router::new()
        .merge(controller::build())
        .merge(doc::build())
        .layer(TraceLayer::new_for_http())
        .layer(middleware::cors(&CONFIG.cors.origin))
        .layer(axum_tracing_opentelemetry::middleware::OtelAxumLayer::default())
        .layer(axum_tracing_opentelemetry::middleware::OtelInResponseLayer)
        .with_state(state))
}

#[tokio::main]
async fn main() -> ApiResult<()> {
    color_eyre::install()?;

    trace::init()?;

    let app = build().await?;

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port)).await?;

    tracing::info!("Listening on port {}", CONFIG.port);

    axum::serve(listener, app).await?;

    Ok(())
}
