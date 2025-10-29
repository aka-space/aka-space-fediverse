use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;
use utoipa::ToSchema;

pub const OAUTH2_TEMPORARY: &str = "oauth2";

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum Provider {
    Google,
    Github,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OAuth2Config {
    pub client_id: ClientId,

    pub client_secret: ClientSecret,

    pub issuer_url: IssuerUrl,

    pub redirect_url: RedirectUrl,

    #[serde(default)]
    pub scopes: String,
}
