use std::sync::Arc;

use tokio::{task::JoinSet, time::sleep};

use crate::state::ApiState;

mod update_post_view;

pub async fn run(state: Arc<ApiState>) {
    let mut join_set = JoinSet::new();

    let s = state.clone();
    join_set.spawn(async move {
        loop {
            let _ = update_post_view::run(s.clone()).await;
            sleep(update_post_view::DELAY).await;
        }
    });

    join_set.join_all().await;
}
