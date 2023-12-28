CREATE TRIGGER trg_after_update_orders
ON orders
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE orders
    SET updated_at = GETDATE()
    FROM orders
    INNER JOIN inserted
    ON orders.id = inserted.id;
END;
