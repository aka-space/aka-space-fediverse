use serde::Deserialize;

pub mod account;
pub mod post;
pub mod reaction;
pub mod tag;

#[derive(Clone, Copy)]
pub struct Pagination {
    pub limit: i64,
    pub offset: i64,
}

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
