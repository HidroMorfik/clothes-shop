<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use \Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       DB::unprepared("
        CREATE TRIGGER trg_instead_of_insert_orders
        ON orders
        INSTEAD OF INSERT
        AS
        BEGIN
            DECLARE @OrderId INT, @UserId INT, @PaymentType VARCHAR(5), @TotalPrice MONEY;

            SELECT @OrderId = id, @UserId = user_id, @PaymentType = payment_type, @TotalPrice = total_price
            FROM inserted;

            INSERT INTO orders (user_id, payment_type, total_price)
            VALUES (@UserId, @PaymentType, @TotalPrice);

            SET @OrderId = SCOPE_IDENTITY();

            INSERT INTO order_meta (order_id, product_info, address)
            VALUES (@OrderId, 'NULL Product Info', 'NULL Address');
        END;
       ");


       DB::unprepared("
        CREATE TRIGGER trg_after_delete_order
        ON orders
        AFTER DELETE
        AS
        BEGIN
            DECLARE @OrderMetaInfo VARCHAR(MAX);

            SELECT @OrderMetaInfo = (SELECT product_info FROM order_meta WHERE order_id = (SELECT id FROM DELETED));

            INSERT INTO deleted_orders_table (order_id, user_id, payment_type, total_price, product_info, deleted_at)
            SELECT id, user_id, payment_type, total_price, @OrderMetaInfo, GETDATE()
            FROM DELETED;

            DELETE FROM order_meta WHERE order_id IN (SELECT id FROM DELETED);
        END
       ");

       DB::unprepared("
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

       ");

        DB::unprepared("
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
       ");

        DB::unprepared("
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
       ");

        DB::unprepared("
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
       ");

        DB::unprepared("
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
       ");

        DB::unprepared("
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
       ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_instead_of_insert_orders');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_delete_order');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_update_users');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_update_orders');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_update_products');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_update_categories');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_update_cities');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_after_update_order_meta');
    }
};
