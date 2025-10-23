CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS account;

CREATE TYPE account.role AS ENUM(
    'member',
    'admin'
);

CREATE TABLE IF NOT EXISTS account.accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    email varchar(128) UNIQUE NOT NULL,
    username varchar(128) UNIQUE NOT NULL,
    password varchar(72) NOT NULL,
    role account.role NOT NULL DEFAULT 'member'::account.role,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
