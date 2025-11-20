use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

pub const fn default_limit() -> u64 {
    10
}

pub const fn default_offset() -> u64 {
    0
}

#[derive(Debug, Clone, Copy, Deserialize)]
pub struct Pagination {
    #[serde(default = "default_limit")]
    pub limit: u64,

    #[serde(default = "default_offset")]
    pub offset: u64,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct Paginated<T> {
    pub has_next: bool,
    pub data: Vec<T>,
}
