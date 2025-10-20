mod claims;

use jsonwebtoken::{DecodingKey, EncodingKey};

pub use claims::Claims;

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
}
