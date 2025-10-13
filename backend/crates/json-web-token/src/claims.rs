use uuid::Uuid;

pub struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}
