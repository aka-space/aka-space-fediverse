use std::sync::Arc;

use axum::{Json, extract::State};
use axum_extra::extract::CookieJar;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{controller::account::util, error::Result, state::ApiState};

#[derive(Serialize, ToSchema)]
#[schema(as = account::info::Info)]
pub struct Info {
    pub email: String,
    pub username: String,
}

#[utoipa::path(
    post,
    tag = "Account",
    path = "/account/info",
    security(("jwt_token" = []))
)]
pub async fn info(State(state): State<Arc<ApiState>>, jar: CookieJar) -> Result<Json<Info>> {
    let account = util::get_account(state.clone(), jar).await?;

    let info = Info {
        email: account.email,
        username: account.username,
    };

    Ok(Json(info))
}
