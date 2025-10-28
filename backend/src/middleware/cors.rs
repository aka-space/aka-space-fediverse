use axum::http::HeaderValue;
use tower_http::cors::CorsLayer;

use crate::config::{ALLOW_HEADERS, ALLOW_METHODS};

pub fn cors(origin: &[String]) -> CorsLayer {
    let allow_origins: Vec<_> = origin
        .iter()
        .map(|origin| origin.parse::<HeaderValue>().unwrap())
        .collect();

    CorsLayer::new()
        .allow_origin(allow_origins)
        .allow_headers(ALLOW_HEADERS)
        .expose_headers(ALLOW_HEADERS)
        .allow_credentials(true)
        .allow_methods(ALLOW_METHODS)
}
