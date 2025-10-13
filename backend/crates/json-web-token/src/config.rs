use serde::Deserialize;

const ENV_PREFIX: &str = "JWT";

#[derive(Debug, Deserialize)]
pub struct Config {
    pub secret: String,
    pub expired_in: u64,
}

impl Config {
    pub fn new() -> Result<Config, config::ConfigError> {
        config::Config::builder()
            .add_source(
                config::Environment::default()
                    .try_parsing(true)
                    .list_separator(",")
                    .prefix(ENV_PREFIX),
            )
            .build()
            .and_then(|x| x.try_deserialize())
    }
}
