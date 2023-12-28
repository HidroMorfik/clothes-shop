CREATE TRIGGER trg_after_update_order_meta
ON order_meta
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE order_meta
    SET updated_at = GETDATE()
    FROM order_meta
    INNER JOIN inserted
    ON order_meta.id = inserted.id;
END;