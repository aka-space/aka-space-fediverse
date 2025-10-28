use serde::Deserialize;

pub const REFRESH_ENDPOINT: &str = "/auth/refresh";
pub const REFRESH_COOKIE: &str = "refresh";

fn default_secret() -> String {
    "secret".to_string()
}

// 5 mins
const fn default_expired_in() -> u64 {
    5 * 60
}

// 1 week
const fn default_refresh_expired_in() -> u64 {
    7 * 24 * 60 * 60
}

#[derive(Debug, Deserialize)]
pub struct JwtConfig {
    #[serde(default = "default_secret")]
    pub secret: String,

    #[serde(default = "default_expired_in")]
    pub expired_in: u64,

    #[serde(default = "default_secret")]
    pub refresh_secret: String,

    #[serde(default = "default_refresh_expired_in")]
    pub refresh_expired_in: u64,
}

impl Default for JwtConfig {
    fn default() -> Self {
        Self {
            secret: default_secret(),
            expired_in: default_expired_in(),
            refresh_secret: default_secret(),
            refresh_expired_in: default_refresh_expired_in(),
        }
    }
}
