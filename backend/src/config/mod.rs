mod bcrypt;
mod cors;
mod jwt;
mod oauth2;
mod redis;
mod s3;

use std::{collections::HashMap, sync::LazyLock};

use serde::Deserialize;

pub use bcrypt::*;
pub use cors::*;
pub use jwt::*;
pub use oauth2::*;
pub use redis::*;
pub use s3::*;

const fn default_port() -> u16 {
    3000
}

fn default_frontend_url() -> String {
    "http://localhost:3000".to_string()
}

fn default_sha256_secret() -> String {
    "secret".to_string()
}

#[derive(Debug, Deserialize)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,

    pub database_url: String,

    #[serde(default = "default_frontend_url")]
    pub frontend_url: String,

    #[serde(default = "default_sha256_secret")]
    pub sha256_secret: String,

    #[serde(default)]
    pub bcrypt: BcryptConfig,

    #[serde(default)]
    pub cors: CorsConfig,

    #[serde(default)]
    pub jwt: JwtConfig,

    pub oauth2: HashMap<Provider, OAuth2Config>,

    #[serde(default)]
    pub redis: RedisConfig,

    pub s3: S3Config,
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
