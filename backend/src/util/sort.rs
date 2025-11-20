use serde::Deserialize;

#[derive(Default, Deserialize)]
pub enum SortDirection {
    #[default]
    Ascending,
    Descending,
}

#[derive(Deserialize)]
pub struct Sort<T> {
    #[serde(default)]
    column: T,

    #[serde(default)]
    direction: SortDirection,
}
