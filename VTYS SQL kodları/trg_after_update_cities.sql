CREATE TRIGGER trg_after_update_cities
ON cities
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE cities
    SET updated_at = GETDATE()
    FROM cities
    INNER JOIN inserted
    ON cities.zip_code = inserted.zip_code;
END;