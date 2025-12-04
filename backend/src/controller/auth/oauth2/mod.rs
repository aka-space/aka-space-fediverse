mod authorized;
mod start;

use openidconnect::{CsrfToken, Nonce, PkceCodeVerifier};
use serde::{Deserialize, Serialize};

pub use authorized::*;
pub use start::*;

#[derive(Debug, Serialize, Deserialize)]
struct OAuth2Session {
    pub csrf: CsrfToken,
    pub nonce: Nonce,
    pub pkce_verifier: PkceCodeVerifier,
    pub origin: String,
}
