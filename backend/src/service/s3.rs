use aws_sdk_s3::{Client, types::ObjectCannedAcl};
use bytes::Bytes;

use crate::error::ApiResult;

pub struct S3Service {
    pub client: Client,
    pub bucket_name: String,
    pub endpoint: String,
}

impl S3Service {
    pub async fn new(bucket_name: &str, endpoint: &str) -> Self {
        let config = aws_config::from_env().load().await;
        let client = Client::new(&config);

        Self {
            client,
            bucket_name: bucket_name.to_string(),
            endpoint: endpoint.to_string(),
        }
    }

    #[tracing::instrument(err(Debug), skip(self, data))]
    pub async fn upload(&self, key: &str, data: Bytes) -> ApiResult<String> {
        self.client
            .put_object()
            .bucket(&self.bucket_name)
            .key(key)
            .acl(ObjectCannedAcl::PublicRead)
            .body(data.into())
            .send()
            .await?;

        let url = format!("{}/{}", self.endpoint, key);

        Ok(url)
    }
}
