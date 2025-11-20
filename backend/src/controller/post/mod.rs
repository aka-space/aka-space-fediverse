mod create;
mod get_by_slug;
mod update;

use std::{collections::HashMap, sync::Arc};

use axum::{Router, http::StatusCode, routing};
use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    database::{self, account::MinimalAccount, reaction::Reaction},
    error::{Error, Result},
    state::ApiState,
};

pub use create::*;
pub use get_by_slug::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/post", routing::post(create))
        .route("/post/{slug}", routing::get(get_by_slug))
        .route("/post/{id}", routing::put(update))
}

#[derive(Debug, Serialize)]
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
    pub async fn from_raw(raw: database::post::Post, database: &PgPool) -> Result<Post> {
        let author = match database::account::get(raw.author_id, database).await {
            Ok(Some(author)) => author,
            Ok(None) => {
                tracing::error!("Post's author is banned");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Post's author is banned".to_string())
                    .build());
            }
            Err(error) => {
                tracing::error!(?error, "Failed to get user");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Post's author is banned".to_string())
                    .build());
            }
        };
        let tags = match database::tag::get_by_post(raw.id, database).await {
            Ok(tags) => tags,
            Err(error) => {
                tracing::error!(?error, "Failed to get post's tag'");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Post is removed".to_string())
                    .build());
            }
        };
        let reactions = match database::reaction::count_by_post(raw.id, database).await {
            Ok(reactions) => reactions,
            Err(error) => {
                tracing::error!(?error, "Failed to count reaction for post");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Post is removed".to_string())
                    .build());
            }
        };

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
