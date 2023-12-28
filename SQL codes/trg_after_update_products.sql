CREATE TRIGGER trg_after_update_products
ON products
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE products
    SET updated_at = GETDATE()
    FROM products
    INNER JOIN inserted
    ON products.id = inserted.id;
END;