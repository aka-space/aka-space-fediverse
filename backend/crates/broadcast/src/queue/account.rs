use serde::{Deserialize, Serialize};
use strum::{AsRefStr, EnumString};
use uuid::Uuid;

pub const EXCHANGE: &str = "account";

#[derive(EnumString, AsRefStr)]
#[strum(serialize_all = "snake_case")]
pub enum Event {
    Create,
    Delete,
}

#[derive(Serialize, Deserialize)]
pub struct Data {
    pub id: Uuid,
}
