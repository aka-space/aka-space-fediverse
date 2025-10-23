mod config;
mod provider;

use anyhow::Result;
use openidconnect::{
    AuthenticationFlow, AuthorizationCode, CsrfToken, EndpointMaybeSet, EndpointNotSet,
    EndpointSet, Nonce, Scope,
    core::{
        CoreClient, CoreIdTokenClaims, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType,
    },
    reqwest,
    url::Url,
};

pub use config::*;
pub use provider::*;

type InnerClient = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointMaybeSet,
    EndpointMaybeSet,
>;

pub struct Client {
    inner: InnerClient,
    http_client: reqwest::Client,
}

impl Client {
    pub async fn new(config: Config) -> Result<Self> {
        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()?;

        let provider_metadata =
            CoreProviderMetadata::discover_async(config.issuer_url, &http_client).await?;

        let inner = CoreClient::from_provider_metadata(
            provider_metadata,
            config.client_id,
            Some(config.client_secret),
        )
        .set_redirect_uri(config.redirect_url);

        Ok(Self { inner, http_client })
    }

    pub fn create_auth_session(&self) -> (Url, CsrfToken, Nonce) {
        self.inner
            .authorize_url(
                AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
                CsrfToken::new_random,
                Nonce::new_random,
            )
            .add_scope(Scope::new("email".to_string()))
            .add_scope(Scope::new("profile".to_string()))
            .url()
    }

    pub async fn get_claims(
        &self,
        code: AuthorizationCode,
        state: CsrfToken,
        csrf: CsrfToken,
        nonce: Nonce,
    ) -> Result<CoreIdTokenClaims> {
        anyhow::ensure!(state.secret() == csrf.secret(), "CSRF token not matched");

        let token_exchange_request = self.inner.exchange_code(code)?;

        let token_response = token_exchange_request
            .request_async(&self.http_client)
            .await?;

        let id_token_verifier: CoreIdTokenVerifier =
            self.inner.id_token_verifier().require_issuer_match(false);
        let id_token = token_response
            .extra_fields()
            .id_token()
            .expect("Provider must provider id token");

        let claims = id_token.claims(&id_token_verifier, &nonce)?;

        Ok(claims.clone())
    }
}
