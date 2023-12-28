CREATE TRIGGER trg_after_update_categories
ON categories
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE categories
    SET updated_at = GETDATE()
    FROM categories
    INNER JOIN inserted
    ON categories.id = inserted.id;
END;