use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Deserialize)]
pub struct Pagination {
    pub limit: i64,
    pub offset: i64,
}

#[derive(Debug, Serialize)]
pub struct Paginated<T> {
    pub has_next: bool,
    pub data: Vec<T>,
}
