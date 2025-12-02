use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

pub const fn default_limit() -> u64 {
    10
}

pub const fn default_offset() -> u64 {
    0
}

pub const fn default_depth() -> u64 {
    2
}

#[derive(Debug, Clone, Copy, Deserialize)]
pub struct SimplePagination {
    #[serde(default = "default_limit")]
    pub limit: u64,

    #[serde(default = "default_offset")]
    pub offset: u64,
}

#[derive(Debug, Deserialize)]
pub struct TreeCursorPagination {
    #[serde(default = "default_limit")]
    pub limit: u64,

    #[serde(default = "default_depth")]
    pub depth: u64,

    #[serde(default)]
    pub cursor: Option<String>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct Paginated<T> {
    pub has_next: bool,
    pub data: Vec<T>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct CursorPaginated<T> {
    pub next_cursor: Option<String>,
    pub data: Vec<T>,
}
