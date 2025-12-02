CREATE EXTENSION IF NOT EXISTS ltree;

ALTER TABLE comments
    ADD COLUMN parent_id uuid DEFAULT NULL REFERENCES comments(id) ON DELETE CASCADE,
    ADD COLUMN path ltree NOT NULL;

CREATE FUNCTION comments_set_path() RETURNS trigger AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path := text2ltree(replace(NEW.id::text, '-', ''));
    ELSE
        SELECT parent.path || text2ltree(replace(NEW.id::text, '-', '')) INTO NEW.path
        FROM comments parent
        WHERE parent.id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comments_set_path
BEFORE INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION comments_set_path();

CREATE INDEX IF NOT EXISTS idx_comments_post_parent_created_id ON comments (post_id, parent_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_comments_path_gist ON comments USING GIST (path);
