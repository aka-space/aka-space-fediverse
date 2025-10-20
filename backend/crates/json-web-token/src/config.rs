use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub secret: String,
    pub expired_in: u64,
}
