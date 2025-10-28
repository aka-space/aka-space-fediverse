CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE role AS ENUM(
    'member',
    'admin'
);

CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    email varchar(128) UNIQUE NOT NULL,
    username varchar(128) UNIQUE NOT NULL,
    password varchar(72) NOT NULL,
    role role NOT NULL DEFAULT 'member'::role,

    is_active boolean NOT NULL DEFAULT true,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
