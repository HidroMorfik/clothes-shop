CREATE TRIGGER TRG_After_Delete_Order
ON orders
AFTER DELETE
AS
BEGIN
    DECLARE @OrderMetaInfo VARCHAR(MAX);

    -- Silinen order'a ait order_meta verisini al
    SELECT @OrderMetaInfo = (SELECT product_info FROM order_meta WHERE order_id = (SELECT id FROM DELETED));

    -- Log kaydını deleted_orders_table'a ekle
    INSERT INTO deleted_orders_table (order_id, user_id, payment_type, total_price, product_info, deleted_at)
    SELECT id, user_id, payment_type, total_price, @OrderMetaInfo, GETDATE()
    FROM DELETED;

    -- İlgili order_meta verisini sil
    DELETE FROM order_meta WHERE order_id IN (SELECT id FROM DELETED);
END
