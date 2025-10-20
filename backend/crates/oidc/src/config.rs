use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
    pub redirect_url: RedirectUrl,
}
