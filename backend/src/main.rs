mod config;
mod constant;
mod controller;
mod database;
mod doc;
mod error;
mod job;
mod middleware;
mod service;
mod state;
mod trace;
mod util;

use std::{net::SocketAddr, sync::Arc};

use axum::Router;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::{config::CONFIG, error::ApiResult, state::ApiState};

async fn build(state: Arc<ApiState>) -> ApiResult<Router> {
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
    if std::env::var("NO_COLOR") == Err(std::env::VarError::NotPresent) {
        color_eyre::install()?;
    } else {
        color_eyre::config::HookBuilder::new()
            .theme(color_eyre::config::Theme::new())
            .install()?;
    }

    trace::init()?;

    let state = ApiState::new().await?;
    let app = build(state.clone()).await?;
    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port)).await?;

    tracing::info!("Listening on port {}", CONFIG.port);

    let (server, _) = tokio::join!(
        axum::serve(
            listener,
            app.into_make_service_with_connect_info::<SocketAddr>()
        ),
        job::run(state)
    );
    server?;

    Ok(())
}
