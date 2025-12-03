use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, PartialEq, Eq, Hash, sqlx::Type, Serialize, Deserialize, ToSchema)]
#[sqlx(rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum Reaction {
    Like,
    Love,
    Haha,
    Wow,
    Sad,
    Angry,
}
