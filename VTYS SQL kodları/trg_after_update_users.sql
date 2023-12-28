CREATE TRIGGER trg_after_update_users
ON users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE users
    SET updated_at = GETDATE()
    FROM users
    INNER JOIN inserted
    ON users.id = inserted.id;
END;
