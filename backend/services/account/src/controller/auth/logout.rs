use axum::http::StatusCode;
use axum_extra::extract::CookieJar;

use crate::error::{Error, Result};

#[utoipa::path(post, tag = "Auth", path = "/auth/logout")]
pub async fn logout(jar: CookieJar) -> Result<CookieJar> {
    match cookie::remove(cookie::TOKEN_KEY, jar) {
        Some(jar) => Ok(jar),
        None => {
            tracing::warn!("Trying to logout before login");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Login first before logout".into())
                .build())
        }
    }
}
