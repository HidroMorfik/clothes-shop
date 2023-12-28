CREATE PROCEDURE GetProductsByCategory
    @category_id VARCHAR(50)
AS
BEGIN
    SELECT products.*, categories.name as category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
    WHERE category_id = @category_id
END;