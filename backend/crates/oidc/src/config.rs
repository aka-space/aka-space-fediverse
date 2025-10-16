use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
    pub redirect_url: RedirectUrl,
}

impl Config {
    pub fn new(prefix: &str) -> Result<Config, config::ConfigError> {
        config::Config::builder()
            .add_source(
                config::Environment::default()
                    .try_parsing(true)
                    .prefix(prefix),
            )
            .build()
            .and_then(|x| x.try_deserialize())
    }
}
