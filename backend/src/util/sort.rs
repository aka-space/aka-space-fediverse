use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Debug, Default, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum SortDirection {
    #[default]
    Ascending,
    Descending,
}

#[derive(Debug, Deserialize)]
pub struct Sort<T: std::fmt::Debug> {
    #[serde(default)]
    pub column: T,

    #[serde(default)]
    pub direction: SortDirection,
}
