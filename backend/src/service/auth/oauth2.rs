use axum::http::StatusCode;
use openidconnect::{
    AuthenticationFlow, AuthorizationCode, CsrfToken, EndpointMaybeSet, EndpointNotSet,
    EndpointSet, Nonce, Scope,
    core::{
        CoreClient, CoreIdTokenClaims, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType,
    },
    reqwest,
    url::Url,
};

use crate::{
    config::OAuth2Config,
    error::{Error, Result},
};

type InnerClient = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointMaybeSet,
    EndpointMaybeSet,
>;

pub struct OAuth2Service {
    inner_client: InnerClient,
    http_client: reqwest::Client,
    scopes: Vec<Scope>,
}

impl OAuth2Service {
    pub async fn new(config: OAuth2Config) -> Self {
        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap();

        let provider_metadata =
            CoreProviderMetadata::discover_async(config.issuer_url, &http_client)
                .await
                .unwrap();

        let inner_client = CoreClient::from_provider_metadata(
            provider_metadata,
            config.client_id,
            Some(config.client_secret),
        )
        .set_redirect_uri(config.redirect_url);

        let scopes = config
            .scopes
            .split(",")
            .map(|raw| Scope::new(raw.to_string()))
            .collect();

        Self {
            inner_client,
            http_client,
            scopes,
        }
    }

    pub fn start(&self) -> (Url, CsrfToken, Nonce) {
        self.inner_client
            .authorize_url(
                AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
                CsrfToken::new_random,
                Nonce::new_random,
            )
            .add_scopes(self.scopes.clone())
            .url()
    }

    pub async fn exchange(
        &self,
        code: AuthorizationCode,
        state: CsrfToken,
        csrf: CsrfToken,
        nonce: Nonce,
    ) -> Result<CoreIdTokenClaims> {
        if state.secret() != csrf.secret() {
            return Err(Error::builder()
                .status(StatusCode::FORBIDDEN)
                .message("CSRF token not matched".into())
                .build());
        }

        let token_exchange_request = match self.inner_client.exchange_code(code) {
            Ok(request) => request,
            Err(error) => {
                tracing::error!(?error, "Failed to create token exchange request");

                return Err(Error::internal());
            }
        };

        let token_response = match token_exchange_request
            .request_async(&self.http_client)
            .await
        {
            Ok(response) => response,
            Err(error) => {
                tracing::error!(?error, "Failed to exchange token");

                return Err(Error::internal());
            }
        };

        let id_token_verifier: CoreIdTokenVerifier = self
            .inner_client
            .id_token_verifier()
            .require_issuer_match(false);
        let id_token = match token_response.extra_fields().id_token() {
            Some(id_token) => id_token,
            None => {
                tracing::error!("Token exchange return empty token");

                return Err(Error::internal());
            }
        };
        let claims = match id_token.claims(&id_token_verifier, &nonce) {
            Ok(claims) => claims,
            Err(error) => {
                tracing::error!(?error, "Failed to decode claims");

                return Err(Error::internal());
            }
        };

        Ok(claims.clone())
    }
}
