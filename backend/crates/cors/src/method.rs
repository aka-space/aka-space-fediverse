use axum::http::Method;

pub const ALLOW_METHODS: [Method; 5] = [
    Method::GET,
    Method::POST,
    Method::DELETE,
    Method::PATCH,
    Method::PUT,
];
