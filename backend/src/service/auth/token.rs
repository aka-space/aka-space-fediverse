use axum_extra::extract::cookie::{Cookie, SameSite};
use uuid::Uuid;

use crate::{
    config::{REFRESH_COOKIE, REFRESH_ENDPOINT},
    service::auth::JwtService,
};

pub struct TokenService {
    pub access: JwtService,
    pub refresh: JwtService,
}

impl TokenService {
    pub fn encode(&self, id: Uuid) -> jsonwebtoken::errors::Result<(String, Cookie<'static>)> {
        let access_token = self.access.encode(id)?;
        let refresh_token = self.refresh.encode(id)?;

        let mut cookie = Cookie::new(REFRESH_COOKIE, refresh_token);
        // refresh_cookie.set_secure(true);
        cookie.set_same_site(SameSite::None);
        // refresh_cookie.set_http_only(true);
        cookie.set_path(REFRESH_ENDPOINT);

        Ok((access_token, cookie))
    }
}
