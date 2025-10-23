use strum::{AsRefStr, EnumString};

pub const EXCHANGE: &str = "account";

#[derive(EnumString, AsRefStr)]
#[strum(serialize_all = "snake_case")]
pub enum Event {
    Create,
    Delete,
}
