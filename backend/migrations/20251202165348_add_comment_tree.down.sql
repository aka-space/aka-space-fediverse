DROP INDEX idx_comments_path_gist;
DROP INDEX idx_comments_post_parent_created_id;

DROP TRIGGER trg_comments_set_path;

DROP FUNCTION comments_set_path;

ALTER TABLE comments
    DROP COLUMN parent_id,
    DROP COLUMN path;
