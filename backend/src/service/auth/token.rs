use std::collections::HashSet;

use axum_extra::extract::cookie::{Cookie, SameSite};
use dashmap::DashMap;
use uuid::Uuid;

use crate::{
    config::{REFRESH_COOKIE, REFRESH_ENDPOINT},
    error::Result,
    service::auth::JwtService,
};

const AUTH_ENDPOINT: &str = "/auth";

pub struct TokenService {
    pub access: JwtService,
    pub refresh: JwtService,
    pub refresh_tokens: DashMap<Uuid, HashSet<String>>,
}

impl TokenService {
    pub fn encode(&self, id: Uuid) -> Result<(String, Cookie<'static>)> {
        let access_token = self.access.encode(id)?;
        let refresh_token = self.refresh.encode(id)?;

        self.refresh_tokens
            .entry(id)
            .or_default()
            .value_mut()
            .insert(refresh_token.clone());

        let mut cookie = Cookie::new(REFRESH_COOKIE, refresh_token);
        // refresh_cookie.set_secure(true);
        cookie.set_same_site(SameSite::None);
        // refresh_cookie.set_http_only(true);
        cookie.set_path(AUTH_ENDPOINT);

        Ok((access_token, cookie))
    }
}
