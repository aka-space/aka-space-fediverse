use serde::Deserialize;

const ENV_PREFIX: &str = "CORS";

#[derive(Debug, Deserialize)]
pub struct Config {
    pub origin: Vec<String>,
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
