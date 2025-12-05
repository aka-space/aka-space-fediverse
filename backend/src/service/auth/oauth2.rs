use axum::http::StatusCode;
use openidconnect::{
    AuthenticationFlow, AuthorizationCode, CsrfToken, EndpointMaybeSet, EndpointNotSet,
    EndpointSet, Nonce, PkceCodeChallenge, PkceCodeVerifier, ProviderMetadataDiscoveryOptions,
    Scope,
    core::{
        CoreClient, CoreIdTokenClaims, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType,
    },
    reqwest,
    url::Url,
};

use crate::{
    config::OAuth2Config,
    ensure,
    error::{ApiResult, OptionExt},
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
    #[tracing::instrument(err(Debug))]
    pub async fn new(config: OAuth2Config) -> ApiResult<Self> {
        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()?;

        let provider_metadata = CoreProviderMetadata::discover_async_with_options(
            config.issuer_url,
            &http_client,
            ProviderMetadataDiscoveryOptions::default().validate_issuer_url(false),
        )
        .await?;

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

        Ok(Self {
            inner_client,
            http_client,
            scopes,
        })
    }

    pub fn start(&self) -> (Url, CsrfToken, Nonce, PkceCodeVerifier) {
        let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

        let (url, csrf, nonce) = self
            .inner_client
            .authorize_url(
                AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
                CsrfToken::new_random,
                Nonce::new_random,
            )
            .set_pkce_challenge(pkce_challenge)
            .add_scopes(self.scopes.clone())
            .url();

        (url, csrf, nonce, pkce_verifier)
    }

    #[tracing::instrument(err(Debug), skip(self))]
    pub async fn exchange(
        &self,
        code: AuthorizationCode,
        state: CsrfToken,
        csrf: CsrfToken,
        nonce: Nonce,
        pkce_verifier: PkceCodeVerifier,
    ) -> ApiResult<CoreIdTokenClaims> {
        ensure!(
            state.secret() == csrf.secret(),
            StatusCode::FORBIDDEN,
            "CSRF token not matched"
        );

        let token_exchange_request = self
            .inner_client
            .exchange_code(code)?
            .set_pkce_verifier(pkce_verifier);

        let token_response = token_exchange_request
            .request_async(&self.http_client)
            .await?;

        let id_token_verifier: CoreIdTokenVerifier = self
            .inner_client
            .id_token_verifier()
            .require_issuer_match(false);
        let id_token = token_response.extra_fields().id_token().with_context(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Token exchange return empty token",
        )?;
        let claims = id_token.claims(&id_token_verifier, &nonce)?;

        Ok(claims.clone())
    }
}
