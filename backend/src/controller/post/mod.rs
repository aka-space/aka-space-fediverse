mod create;
mod create_comment;
mod get_by_slug;
mod get_comment;
mod query;
mod react;
mod update;
mod view;

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
pub use create_comment::*;
pub use get_by_slug::*;
pub use get_comment::*;
pub use query::*;
pub use react::*;
pub use update::*;
pub use view::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/post", routing::post(create))
        .route("/post", routing::get(query))
        // this is actually /post/{slug} but it conflict with /post/{id}
        .route("/post/{id}", routing::get(get_by_slug))
        .route("/post/{id}", routing::put(update))
        .route("/post/{id}/view", routing::post(view))
        .route("/post/{id}/react", routing::post(react))
        .route("/post/{id}/comment", routing::post(create_comment))
        .route("/post/{id}/comment", routing::get(get_comment))
}

#[derive(Debug, Serialize, ToSchema)]
pub struct Post {
    pub id: Uuid,
    pub slug: String,

    pub author: MinimalAccount,
    pub tags: Vec<String>,
    pub title: String,
    pub content: String,
    pub view: i32,
    pub reactions: HashMap<Reaction, u64>,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Post {
    pub async fn from_raw(raw: database::post::Post, database: &PgPool) -> ApiResult<Post> {
        let opt_author = database::account::get(raw.author_id, database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "Post's author is banned")?;
        let author = opt_author.with_context(StatusCode::BAD_REQUEST, "Post's author is banned")?;

        let tags = database::tag::get_by_post(raw.id, database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "Post is removed")?;

        let reactions = database::reaction::count_by_post(raw.id, database)
            .await
            .with_context(StatusCode::BAD_REQUEST, "Post is removed")?;

        Ok(Post {
            id: raw.id,
            slug: raw.slug,
            tags,
            author: MinimalAccount {
                email: author.email,
                username: author.username,
            },
            title: raw.title,
            content: raw.content,
            view: raw.view,
            reactions,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
        })
    }
}
