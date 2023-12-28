CREATE PROCEDURE GetOrdersByPaymentType
    @PaymentType VARCHAR(50)
AS
BEGIN
    SELECT orders.*, users.name as user_name, users.surname as user_surname
    FROM orders
    JOIN users ON orders.user_id = users.id
    WHERE payment_type = @PaymentType
END;