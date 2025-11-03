use axum::http::StatusCode;
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

use crate::error::{Error, Result};
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

    pub fn encode(&self, id: Uuid) -> Result<String> {
        let now = Local::now().timestamp() as u64;

        let claims = Claims {
            sub: id,
            exp: now + self.expired_in,
        };

        let token = match jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key) {
            Ok(token) => token,
            Err(error) => {
                tracing::error!(?error, "Failed to generate token");

                return Err(Error::internal());
            }
        };

        Ok(token)
    }

    pub fn decode(&self, token: &str) -> Result<Uuid> {
        let token =
            match jsonwebtoken::decode::<Claims>(token, &self.decoding_key, &Validation::default())
            {
                Ok(token) => token,
                Err(error) => {
                    tracing::error!(token, ?error, "Failed to decode token");

                    return Err(Error::builder()
                        .status(StatusCode::UNAUTHORIZED)
                        .message("Invalid token".to_string())
                        .build());
                }
            };

        Ok(token.claims.sub)
    }
}
