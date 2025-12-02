use serde::Deserialize;

fn default_url() -> String {
    "redis://127.0.0.1/".to_string()
}

const fn default_cache_ttl() -> u64 {
    60 * 60
}

#[derive(Debug, Deserialize)]
pub struct RedisConfig {
    #[serde(default = "default_url")]
    pub url: String,

    #[serde(default = "default_cache_ttl")]
    pub cache_ttl: u64,
}
