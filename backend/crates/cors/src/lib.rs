mod header;
mod method;

use axum::http::{HeaderValue, header::InvalidHeaderValue};
use tower_http::cors::CorsLayer;

use crate::{header::ALLOW_HEADERS, method::ALLOW_METHODS};

pub fn new(origin: &[String]) -> Result<CorsLayer, InvalidHeaderValue> {
    let origin = origin
        .iter()
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
