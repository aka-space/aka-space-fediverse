use anyhow::Result;
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}

pub struct Jwt {
    pub encoding_key: EncodingKey,
    pub decoding_key: DecodingKey,
    pub expired_in: u64,
}

impl Jwt {
    pub fn new(secret: &[u8], expired_in: u64) -> Self {
        Self {
            encoding_key: EncodingKey::from_secret(secret),
            decoding_key: DecodingKey::from_secret(secret),
            expired_in,
        }
    }

    pub fn encode(&self, id: Uuid) -> Result<String> {
        let now = Local::now().timestamp() as u64;

        let claims = Claims {
            sub: id,
            exp: now + self.expired_in,
        };

        let token = jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key)?;

        Ok(token)
    }

    pub fn decode(&self, token: &str) -> Result<Uuid> {
        let token_data =
            jsonwebtoken::decode::<Claims>(token, &self.decoding_key, &Validation::default())?;

        Ok(token_data.claims.sub)
    }
}
