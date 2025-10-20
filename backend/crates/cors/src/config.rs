use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub origin: Vec<String>,
}
