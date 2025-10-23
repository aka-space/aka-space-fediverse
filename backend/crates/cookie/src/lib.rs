use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};

pub const TOKEN_KEY: &str = "token";

pub fn add(key: &'static str, value: String, jar: CookieJar) -> CookieJar {
    let mut cookie = Cookie::new(key, value);
    // cookie.set_secure(true);
    cookie.set_same_site(SameSite::None);
    // cookie.set_http_only(true);
    cookie.set_path("/");

    jar.add(cookie)
}

pub fn get(key: &'static str, jar: CookieJar) -> Option<Cookie<'static>> {
    jar.get(key).cloned()
}

pub fn remove(key: &'static str, jar: CookieJar) -> Option<CookieJar> {
    let mut cookie = jar.get(key).cloned()?;
    cookie.set_path("/");
    cookie.make_removal();

    Some(jar.remove(cookie))
}
