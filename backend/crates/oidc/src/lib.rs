mod config;
mod provider;

use openidconnect::{EndpointMaybeSet, EndpointNotSet, EndpointSet, core::CoreClient, reqwest};

pub use config::*;
pub use provider::Provider;

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
