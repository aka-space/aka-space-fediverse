mod authorized;
mod start;

pub use authorized::*;
pub use start::*;

const SESSION_PREFIX: &str = "session";
const OAUTH2_TEMPORARY: &str = "oauth2";
