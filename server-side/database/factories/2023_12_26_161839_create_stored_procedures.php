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
            CREATE PROCEDURE GetOrdersByPaymentType
            @PaymentType VARCHAR(50)
            AS
            BEGIN
                SELECT orders.*, users.name as user_name, users.surname as user_surname
                FROM orders
                JOIN users ON orders.user_id = users.id
                WHERE payment_type = @PaymentType
            END;
        ");

        DB::unprepared("
            CREATE PROCEDURE GetProductsByCategory
            @category_id VARCHAR(50)
            AS
            BEGIN
                SELECT products.*, categories.name as category_name
                FROM products
                JOIN categories ON products.category_id = categories.id
                WHERE category_id = @category_id
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS GetOrdersByPaymentType');
        DB::unprepared('DROP PROCEDURE IF EXISTS GetProductsByCategory');
    }
};
