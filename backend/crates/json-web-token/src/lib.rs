mod claims;
mod config;

use jsonwebtoken::{DecodingKey, EncodingKey};

pub use claims::Claims;
pub use config::Config;

pub struct Jwt {
    pub encoding_key: EncodingKey,
    pub decoding_key: DecodingKey,
    pub expired_in: u64,
}

impl Jwt {
    pub fn new(config: Config) -> Self {
        Self {
            encoding_key: EncodingKey::from_secret(config.secret.as_bytes()),
            decoding_key: DecodingKey::from_secret(config.secret.as_bytes()),
            expired_in: config.expired_in,
        }
    }
}
