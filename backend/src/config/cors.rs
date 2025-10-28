use axum::http::{
    HeaderName, Method,
    header::{
        ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
        ACCESS_CONTROL_ALLOW_ORIGIN, AUTHORIZATION, CONTENT_TYPE, ORIGIN,
    },
};
use serde::Deserialize;

pub const ALLOW_METHODS: [Method; 5] = [
    Method::GET,
    Method::POST,
    Method::DELETE,
    Method::PATCH,
    Method::PUT,
];

pub const ALLOW_HEADERS: [HeaderName; 7] = [
    ORIGIN,
    AUTHORIZATION,
    ACCESS_CONTROL_ALLOW_ORIGIN,
    CONTENT_TYPE,
    ACCEPT,
    ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_HEADERS,
];

fn default_origin() -> Vec<String> {
    vec!["localhost:3000".to_string()]
}

#[derive(Debug, Deserialize)]
pub struct CorsConfig {
    #[serde(default = "default_origin")]
    pub origin: Vec<String>,
}

impl Default for CorsConfig {
    fn default() -> Self {
        Self {
            origin: default_origin(),
        }
    }
}
