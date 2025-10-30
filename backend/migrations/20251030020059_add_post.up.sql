CREATE TABLE IF NOT EXISTS posts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    author_id uuid NOT NULL REFERENCES accounts(id),
    title text NOT NULL,
    content text NOT NULL,
    view int NOT NULL DEFAULT 0,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    name varchar(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags(
    post_id uuid NOT NULL REFERENCES posts(id),
    tag_id uuid NOT NULL REFERENCES tags(id),

    PRIMARY KEY (post_id, tag_id)
);

CREATE TYPE reaction AS ENUM(
    'like',
    'love',
    'haha',
    'wow',
    'sad',
    'angry'
);

CREATE TABLE IF NOT EXISTS post_reactions(
    post_id uuid NOT NULL REFERENCES posts(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    kind reaction NOT NULL,

    PRIMARY KEY (post_id, account_id)
);

CREATE TABLE IF NOT EXISTS post_comments(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    post_id uuid NOT NULL REFERENCES posts(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    content uuid NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
