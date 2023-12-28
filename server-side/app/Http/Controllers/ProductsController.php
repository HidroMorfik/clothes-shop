<?php

namespace App\Http\Controllers;

use App\Helpers\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductsController extends Controller
{

    public function getProductsByCategory($category_id)
    {
        $products = DB::select('EXEC GetProductsByCategory ?', [$category_id]);
        return response()->json([
            "message" => "successfully indexed",
            "data" => $products
        ],201);
    }

    public function index(){
        $products = DB::select("
            SELECT products.*, categories.name as category_name
            FROM products
            JOIN categories ON products.category_id = categories.id
    ");
        return response()->json([
            "message" => "all products successfully indexed",
            "data" => $products
        ],201);

    }


    public function show($id){
            $product =  DB::select(
                'SELECT * FROM products WHERE (id = ?)', [$id]
            );

            if($product != [])
                return response()->json([
                    "message" => "Product successfully showed",
                    "data" => $product[0]
                ],201);
            else
                return response()->json([
                    "message" => "Product not found",
                    "data" => null
                ],401);
    }


    public function store(Request $request){

        $this->validate($request, [
            "category_id" => "required",
            "name" => "required",
            "price" => "required",
            "description" => 'required',
            "stock" => "required"
        ]);


        $category_id = $request->input('category_id');
        $name = $request->input('name');
        $price = $request->input('price');
        $description = $request->input('description');
        $stock = $request->input('stock');
        $picture = $request->input('picture');


        if (User::isManager($request->input("sess_id"))){
            $is_created = DB::insert('
                    INSERT INTO products (category_id, name, price, description, stock, picture)
                                VALUES (?, ?, ?, ?, ?, ?)', [$category_id, $name, $price, $description, $stock, $picture]);

            if ($is_created == true){
                $product = DB::select('SELECT * FROM products WHERE (name = ?)',[$name]);
                return response()->json([
                    "message" => "Product successfully created",
                    "data" => $product
                ],201);
            }
            else
                return response()->json([
                    "message" => "Product can't create",
                    "data" => null
                ],501);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);
    }

    public function update(Request $request, $id){
        $existingProduct = DB::select('SELECT * FROM products WHERE (id = ?)', [intval($id) ]);

        if (User::isManager($request->input("sess_id"))){
            if ($existingProduct) {

                $category_id = $request->input('category_id')?? $existingProduct[0]->category_id;
                $name = $request->input('name')?? $existingProduct[0]->name;
                $price = $request->input('price')?? $existingProduct[0]->price;
                $description = $request->input('description')?? $existingProduct[0]->descripton;
                $stock = $request->input('stock')?? $existingProduct[0]->stock;
                $picture = $request->input('price')?? $existingProduct[0]->price;


                $updateResult = DB::update('UPDATE products SET category_id = ?, name = ?, price = ?, description = ?, stock = ?, price = ? WHERE id = ?', [$category_id, $name, $price, $description, $stock, $picture, $id]);



                if ($updateResult > 0) {
                    // Update successful
                    $updatedProduct = DB::select('SELECT * FROM products WHERE (id = ?)', [$id]);
                    return response()->json([
                        "message" => "Product successfully updated",
                        "data" => $updatedProduct
                    ],201);
                } else {
                    // Update failed
                    return response()->json([
                        "message" => "Product update failed",
                        "data" => null
                    ],501);
                }
            } else {
                return response()->json([
                    "message" => "Product not found",
                    "data" => null
                ],401);
            }
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);


    }



    public function delete(Request $request, $id){

        $existingProduct = DB::select('SELECT * FROM products WHERE (id = ?)', [intval($id) ]);

        if (User::isManager($request->header("sess_id"))){
            if ($existingProduct) {
                // Product exists, proceed with the deletion
                $deleteResult = DB::delete('DELETE FROM products WHERE id = ?', [intval($id)]);

                if ($deleteResult > 0) {
                    // Deletion successful
                    return response([
                        "message" => "Product successfully deleted",
                        "data" => null
                    ],201);
                } else {
                    // Deletion failed
                    return response([
                        "message" => "Product deletion failed",
                        "data" => $existingProduct[0]
                    ],501);
                }
            } else
                return response([
                    "message" => "Product not found",
                    "data" => null
                ],401);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);
    }


}
