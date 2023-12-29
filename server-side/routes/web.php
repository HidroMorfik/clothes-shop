<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\UserController;
use \App\Http\Controllers\CityController;
use \App\Http\Controllers\CategoryController;
use \App\Http\Controllers\ProductsController;
use \App\Http\Controllers\OrderController;
use \App\Http\Controllers\DatabaseBackupController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::post("/login", [\App\Http\Controllers\AuthController::class, "login"])->name("login");

Route::post("/logout", [\App\Http\Controllers\AuthController::class, "logout"])->name("logout");

Route::get("/md5/{metin}", function ($metin){
    dd([
        "metin" => $metin,
        "md5 sifreli hali" => md5($metin)
    ]);
});


//GET (SUNUCUDAN İSTENEN VERİ)
//POST (SUNUCUYA GÖNDERİLEN VERİ)
//PUT (SUNUCUDAKİ VERİYİ GÜNCELLEME)
//DELETE (SUNUCUDAKİ VERİYİ SİLME)

// USER ENDPOINT





Route::group(["middleware"=> "auth"], function (){
    Route::group(["prefix"=>"db"], function (){
        Route::get("/",[DatabaseBackupController::class,"index"]);
        Route::post("/backup",[DatabaseBackupController::class,"backup"]);
        Route::post("/restore",[DatabaseBackupController::class,"restore"]);
    });

    Route::group(["prefix"=>"users"], function (){
        Route::get("/",[UserController::class,"index"])->name("users");
        Route::get("/{id}",[UserController::class,"show"])->name("users.show");
        Route::post("/create", [UserController::class,"store"])->name("users.create");
        Route::put("/update/{id}", [UserController::class,"update"])->name("users.update");
        Route::delete("/delete/{id}", [UserController::class,"delete"])->name("users.delete");
    });

    // CITES ENDPOINT
    Route::group(["prefix"=>"cities"], function (){
        Route::get("/",[CityController::class,"index"])->name("cities");
        Route::get("/{id}",[CityController::class,"show"])->name("cities.show");
        Route::post("/create", [CityController::class,"store"])->name("cities.create");
        Route::put("/update/{id}", [CityController::class,"update"])->name("cities.update");
        Route::delete("/delete/{id}", [CityController::class,"delete"])->name("cities.delete");
    });

    // CATEGORIES ENDPOINT
    Route::group(["prefix"=>"categories"], function (){
        Route::post("/create", [CategoryController::class,"store"])->name("categories.create");
        Route::put("/update/{id}", [CategoryController::class,"update"])->name("categories.update");
        Route::delete("/delete/{id}", [CategoryController::class,"delete"])->name("categories.delete");
    });

    // PRODUCTS ENDPOINT
    Route::group(["prefix"=>"products"], function (){
        Route::post("/create", [ProductsController::class,"store"])->name("products.create");
        Route::put("/update/{id}", [ProductsController::class,"update"])->name("products.update");
        Route::delete("/delete/{id}", [ProductsController::class,"delete"])->name("products.delete");
    });

    // ORDERS ENDPOINT
    Route::group(["prefix"=>"orders"], function (){
        Route::get("/",[OrderController::class,"index"])->name("orders");
        Route::get("/by-payment-type/{paymentType}",[OrderController::class,"getOrdersByPaymentType"]);
        Route::get("/{id}",[OrderController::class,"show"])->name("orders.show");
        Route::post("/create", [OrderController::class,"store"])->name("orders.create");
        Route::put("/update/{id}", [OrderController::class,"update"])->name("orders.update");
        Route::delete("/delete/{id}", [OrderController::class,"delete"])->name("orders.delete");
    });
});


Route::group(["prefix"=>"products"], function (){
    Route::get("/",[ProductsController::class,"index"])->name("products");
    Route::get("/by-category/{category_id}", [ProductsController::class, "getProductsByCategory"]);
    Route::get("/{id}",[ProductsController::class,"show"])->name("products.show");
});

Route::group(["prefix"=>"categories"], function () {
    Route::get("/", [CategoryController::class, "index"])->name("categories");
    Route::get("/{id}", [CategoryController::class, "show"])->name("categories.show");
});
