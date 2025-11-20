use std::sync::Arc;

use axum::Router;
use utoipa::{
    Modify, OpenApi,
    openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme},
};
use utoipa_swagger_ui::SwaggerUi;

use crate::{config::Provider, database, error::Error, util::SortDirection};

use super::{controller, state::ApiState};

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "jwt_token",
                SecurityScheme::Http(
                    HttpBuilder::new()
                        .scheme(HttpAuthScheme::Bearer)
                        .bearer_format("JWT")
                        .build(),
                ),
            )
        }
    }
}

#[derive(OpenApi)]
#[openapi(
    paths(
        controller::ping,

        controller::account::get_by_username,

        controller::auth::register,
        controller::auth::login,
        controller::auth::me,
        controller::auth::refresh,
        controller::auth::logout,
        controller::auth::oauth2::start,

        controller::post::create,
        controller::post::get_by_slug,
        controller::post::query,
        controller::post::update,

        controller::tag::get_all,
    ),
    components(schemas(
        Provider,
        SortDirection,
        database::post::SortableColumn,
        Error,
    )),
    modifiers(&SecurityAddon),
)]
struct ApiDoc;

pub fn build() -> Router<Arc<ApiState>> {
    SwaggerUi::new("/swagger-ui")
        .url("/api-docs/openapi.json", ApiDoc::openapi())
        .into()
}
