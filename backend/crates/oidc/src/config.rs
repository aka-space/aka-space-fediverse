use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};

pub struct ClientConfig {
    pub id: ClientId,
    pub secret: ClientSecret,
    pub issuer_url: IssuerUrl,
}
