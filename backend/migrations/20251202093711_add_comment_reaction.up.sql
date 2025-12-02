CREATE TABLE IF NOT EXISTS comment_reactions(
    comment_id uuid NOT NULL REFERENCES post_comments(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    kind reaction NOT NULL,

    PRIMARY KEY (comment_id, account_id)
);
