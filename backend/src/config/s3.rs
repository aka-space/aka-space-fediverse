use serde::Deserialize;

fn default_bucket_name() -> String {
    "aka".to_string()
}

#[derive(Debug, Deserialize)]
pub struct S3Config {
    #[serde(default = "default_bucket_name")]
    pub bucket_name: String,

    pub endpoint: String,
}
