use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Default, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum SortDirection {
    #[default]
    Ascending,
    Descending,
}

#[derive(Deserialize)]
pub struct Sort<T> {
    #[serde(default)]
    pub column: T,

    #[serde(default)]
    pub direction: SortDirection,
}
