use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum Provider {
    Google,
    Github,
}
