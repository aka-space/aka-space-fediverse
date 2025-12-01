use axum::http::StatusCode;
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

use crate::error::{ApiResult, ResultExt};
use crate::service::auth::Claims;

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

    #[tracing::instrument(err(Debug), skip(self))]
    pub fn encode(&self, id: Uuid) -> ApiResult<String> {
        let now = Local::now().timestamp() as u64;

        let claims = Claims {
            sub: id,
            exp: now + self.expired_in,
        };

        let token = jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key)?;

        Ok(token)
    }

    #[tracing::instrument(err(Debug), skip(self))]
    pub fn decode(&self, token: &str) -> ApiResult<Uuid> {
        let token =
            jsonwebtoken::decode::<Claims>(token, &self.decoding_key, &Validation::default())
                .with_context(StatusCode::UNAUTHORIZED, "Invalid token")?;

        Ok(token.claims.sub)
    }
}
