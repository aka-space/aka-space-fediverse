mod config;
mod header;
mod method;

use axum::http::{HeaderValue, header::InvalidHeaderValue};
use tower_http::cors::CorsLayer;

pub use crate::config::Config;
use crate::{header::ALLOW_HEADERS, method::ALLOW_METHODS};

pub fn new(config: Config) -> Result<CorsLayer, InvalidHeaderValue> {
    let origin = config
        .origin
        .into_iter()
        .map(|x| x.parse::<HeaderValue>())
        .collect::<Result<Vec<_>, _>>()?;

    let layer = CorsLayer::new()
        .allow_origin(origin)
        .allow_headers(ALLOW_HEADERS)
        .expose_headers(ALLOW_HEADERS)
        .allow_credentials(true)
        .allow_methods(ALLOW_METHODS);

    Ok(layer)
}
