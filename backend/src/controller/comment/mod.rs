mod create;
mod get_by_post;
mod react;
mod reply;
mod update;

use std::{collections::HashMap, sync::Arc};

use axum::{Router, http::StatusCode, routing};
use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    database::{self, account::MinimalAccount, reaction::Reaction},
    error::{ApiResult, OptionExt, ResultExt},
    state::ApiState,
};

pub use create::*;
pub use get_by_post::*;
pub use react::*;
pub use reply::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/post/{id}/comment", routing::post(create))
        .route("/post/{id}/comment", routing::get(get_by_post))
        .route("/comment/{id}", routing::put(update))
        .route("/comment/{id}/reply", routing::post(reply))
        .route("/comment/{id}/react", routing::post(react::react))
}

#[derive(Debug, Serialize, ToSchema)]
#[schema(example = json!({
    "id": "00000000-0000-0000-0000-000000000000",
    "account": { "email": "user@example.com", "username": "someuser" },
    "content": "This is a comment",
    "created_at": "2025-11-21T00:00:00Z",
    "updated_at": "2025-11-21T00:00:00Z"
}))]
pub struct Comment {
    pub id: Uuid,

    pub parent_id: Option<Uuid>,
    pub children_count: usize,

    pub account: MinimalAccount,
    pub content: String,
    pub reactions: HashMap<Reaction, u64>,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Comment {
    pub async fn from_raw(
        raw: database::comment::Comment,
        database: &PgPool,
    ) -> ApiResult<Comment> {
        let opt_account = database::account::get(raw.account_id, database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "Comment's author is banned")?;
        let account =
            opt_account.with_context(StatusCode::BAD_REQUEST, "Comment's author is banned")?;

        let reactions = database::comment::count_reactions(raw.id, database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "Comment is removed")?;

        Ok(Comment {
            id: raw.id,
            parent_id: raw.parent_id,
            children_count: raw.children_count as usize,
            account: MinimalAccount {
                email: account.email,
                username: account.username,
            },
            content: raw.content,
            reactions,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
        })
    }
}
