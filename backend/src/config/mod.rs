mod bcrypt;
mod cors;
mod jwt;

use std::sync::LazyLock;

use serde::Deserialize;

pub use bcrypt::*;
pub use cors::*;
pub use jwt::*;

const fn default_port() -> u16 {
    3000
}

#[derive(Debug, Deserialize)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,

    pub database_url: String,

    #[serde(default)]
    pub bcrypt: BcryptConfig,

    #[serde(default)]
    pub cors: CorsConfig,

    #[serde(default)]
    pub jwt: JwtConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    let config = ::config::Config::builder()
        .add_source(
            ::config::Environment::default()
                .try_parsing(true)
                .separator("__")
                .list_separator(","),
        )
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap();

    tracing::info!("Run with config: {:#?}", config);

    config
});
