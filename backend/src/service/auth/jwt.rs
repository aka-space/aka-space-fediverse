use axum_extra::extract::cookie::{Cookie, SameSite};
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

use crate::{
    config::{REFRESH_COOKIE, REFRESH_ENDPOINT},
    service::auth::Claims,
};

#[derive(Debug)]
pub struct JwtService {
    pub encoding_key: EncodingKey,
    pub decoding_key: DecodingKey,
    pub expired_in: u64,
}

impl JwtService {
    pub fn new(secret: &str, expired_in: u64) -> Self {
        Self {
            encoding_key: EncodingKey::from_secret(secret.as_bytes()),
            decoding_key: DecodingKey::from_secret(secret.as_bytes()),
            expired_in,
        }
    }

    pub fn encode(&self, id: Uuid) -> jsonwebtoken::errors::Result<String> {
        let now = Local::now().timestamp() as u64;

        let claims = Claims {
            sub: id,
            exp: now + self.expired_in,
        };

        let token = match jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key) {
            Ok(token) => token,
            Err(error) => {
                tracing::error!(?error, "Failed to generate token");

                return Err(error);
            }
        };

        Ok(token)
    }

    pub fn decode(&self, token: &str) -> jsonwebtoken::errors::Result<Uuid> {
        let token =
            match jsonwebtoken::decode::<Claims>(token, &self.decoding_key, &Validation::default())
            {
                Ok(token) => token,
                Err(error) => {
                    tracing::error!(token, ?error, "Failed to decode token");

                    return Err(error);
                }
            };

        Ok(token.claims.sub)
    }
}

pub struct JwtRefresh {
    pub jwt: JwtService,
}

impl JwtRefresh {
    pub fn encode(&self, id: Uuid) -> jsonwebtoken::errors::Result<Cookie<'static>> {
        let token = self.jwt.encode(id)?;

        let mut cookie = Cookie::new(REFRESH_COOKIE, token);
        // refresh_cookie.set_secure(true);
        cookie.set_same_site(SameSite::None);
        // refresh_cookie.set_http_only(true);
        cookie.set_path(REFRESH_ENDPOINT);

        Ok(cookie)
    }

    pub fn decode(&self, cookie: &Cookie<'static>) -> jsonwebtoken::errors::Result<Uuid> {
        let token = cookie.value();

        self.jwt.decode(token)
    }
}
