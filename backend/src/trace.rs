use opentelemetry::global;
use opentelemetry_otlp::SpanExporter;
use opentelemetry_sdk::trace::SdkTracerProvider;
use tracing::level_filters::LevelFilter;
use tracing_error::ErrorLayer;
use tracing_opentelemetry::OpenTelemetryLayer;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

use crate::error::ApiResult;

const SERVICE_NAME: &str = "backend";

pub fn init() -> ApiResult<()> {
    let otlp_exporter = SpanExporter::builder().with_http().build()?;

    let resource = opentelemetry_sdk::Resource::builder()
        .with_service_name(SERVICE_NAME)
        .build();

    let tracer_provider = SdkTracerProvider::builder()
        .with_batch_exporter(otlp_exporter)
        .with_resource(resource)
        .build();

    global::set_tracer_provider(tracer_provider);

    let tracer = global::tracer("backend-tracer");
    let otel_layer = OpenTelemetryLayer::new(tracer);

    tracing_subscriber::registry()
        .with(ErrorLayer::default())
        .with(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .with(tracing_subscriber::fmt::layer())
        .with(otel_layer)
        .init();

    Ok(())
}
