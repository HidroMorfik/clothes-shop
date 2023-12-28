CREATE TRIGGER trg_instead_of_insert_orders
ON orders
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @OrderId INT, @UserId INT, @PaymentType VARCHAR(5), @TotalPrice MONEY;

    -- INSERT edilen verileri al
    SELECT @OrderId = id, @UserId = user_id, @PaymentType = payment_type, @TotalPrice = total_price
    FROM inserted;

    -- Önce orders tablosuna ekleme yap
    INSERT INTO orders (user_id, payment_type, total_price)
    VALUES (@UserId, @PaymentType, @TotalPrice);

    SET @OrderId = SCOPE_IDENTITY();

    -- Sonra order_meta tablosuna varsayılan değerlerle ekleme yap
    INSERT INTO order_meta (order_id, product_info, address)
    VALUES (@OrderId, 'NULL Product Info', 'NULL Address');
END;
