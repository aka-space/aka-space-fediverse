use axum::http::{
    HeaderName, HeaderValue, Method,
    header::{
        ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
        ACCESS_CONTROL_ALLOW_ORIGIN, AUTHORIZATION, CONTENT_TYPE, InvalidHeaderValue, ORIGIN,
    },
};
use serde::Deserialize;
use tower_http::cors::CorsLayer;

const ALLOW_HEADERS: [HeaderName; 7] = [
    ORIGIN,
    AUTHORIZATION,
    ACCESS_CONTROL_ALLOW_ORIGIN,
    CONTENT_TYPE,
    ACCEPT,
    ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_HEADERS,
];
const ALLOW_METHODS: [Method; 5] = [
    Method::GET,
    Method::POST,
    Method::DELETE,
    Method::PATCH,
    Method::PUT,
];

#[derive(Debug, Deserialize)]
pub struct Config {
    pub origin: Vec<String>,
}

impl Config {
    pub fn build(self) -> Result<CorsLayer, InvalidHeaderValue> {
        let origin = self
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
}
