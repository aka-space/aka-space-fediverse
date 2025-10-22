use std::sync::LazyLock;

use serde::Deserialize;
use serde_with::{Bytes, serde_as};

const fn default_port() -> u16 {
    3000
}

fn default_cors_origin() -> Vec<String> {
    vec!["localhost:3000".to_string()]
}

const fn default_bcrypt_cost() -> u32 {
    10
}

fn default_jwt_secret() -> String {
    "secret".to_string()
}

const fn default_jwt_expired_in() -> u64 {
    // 1 day
    24 * 60 * 60
}

const fn default_bcrypt_salt() -> [u8; 16] {
    [0; 16]
}

fn default_amqp_url() -> String {
    "amqp://127.0.0.1:5672/%2f".to_string()
}

#[serde_as]
#[derive(Debug, Deserialize)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,

    #[serde(default = "default_cors_origin")]
    pub cors_origin: Vec<String>,

    #[serde(default = "default_bcrypt_cost")]
    pub bcrypt_cost: u32,

    #[serde(default = "default_bcrypt_salt")]
    #[serde_as(as = "Bytes")]
    pub bcrypt_salt: [u8; 16],

    #[serde(default = "default_jwt_secret")]
    pub jwt_secret: String,

    #[serde(default = "default_jwt_expired_in")]
    pub jwt_expired_in: u64,

    pub database_url: String,

    #[serde(default = "default_amqp_url")]
    pub amqp_url: String,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    let config = ::config::Config::builder()
        .add_source(
            ::config::Environment::default()
                .try_parsing(true)
                .separator("__"),
        )
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap();

    tracing::info!("Run with config: {:#?}", config);

    config
});
