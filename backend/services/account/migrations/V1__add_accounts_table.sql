CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXITST accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    email varchar(128) UNIQUE NOT NULL,
    name varchar(64),
    password varchar(72) NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
);
