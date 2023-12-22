<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductsController extends Controller
{
    public function index(){
            $products =  DB::select(
                'SELECT * FROM products'
            );

            return response([
                "code" => "201",
                "message" => "all products successfully indexed",
                "data" => $products
            ]);
    }


    public function show($id){
        $product =  DB::select(
            'SELECT * FROM products WHERE (id = ?)', [$id]
        );

        if($product != [])
            return response([
                "code" => "201",
                "message" => "Product successfully showed",
                "data" => $product
            ]);
        else
            return response([
                "code" => "501",
                "message" => "Product not found",
                "data" => null
            ]);
    }


    public function store(Request $request){

        $this->validate($request, [
            "category_id" => "required",
            "name" => "required",
            "price" => "required",
            "description" => ['required'],
            "stock" => "required"
        ]);


        $category_id = $request->input('category_id');
        $name = $request->input('name');
        $price = $request->input('price');
        $description = $request->input('description');
        $stock = $request->input('stock');
        $picture = $request->input('picture');


        $encodedImage = base64_encode(file_get_contents($picture));
        $is_created = DB::insert('INSERT INTO products (category_id, name, price, descripton, stock, picture) VALUES (?, ?, ?, ?, ?, CAST(? AS varbinary(max)))', [$category_id, $name, $price, $description, $stock, $encodedImage]);

        if ($is_created == true){
            $product = DB::select('SELECT * FROM products WHERE (name = ?)',[$name]);
            return response([
                "code" => "201",
                "message" => "Product successfully created",
                "data" => $product
            ]);
        }
        else
            return response([
                "code" => "501",
                "message" => "Product can't create",
                "data" => null
            ]);
    }

    public function update(Request $request, $id){


        $existingProduct = DB::select('SELECT * FROM products WHERE (id = ?)', [intval($id) ]);

        if ($existingProduct) {

            $category_id = $request->input('category_id')?? $existingProduct[0]->category_id;
            $name = $request->input('name')?? $existingProduct[0]->name;
            $price = $request->input('price')?? $existingProduct[0]->price;
            $description = $request->input('description')?? $existingProduct[0]->descripton;
            $stock = $request->input('stock')?? $existingProduct[0]->stock;
            $picture = $request->input('picture') ?? $existingProduct[0]->picture;

            // Eğer $picture base64 kodlu değilse, base64'e çevir ve güncelleme işlemine dahil et
            if (!$this->isBase64Encoded($picture)) {
                $encodedImage = base64_encode(file_get_contents($picture));
                $updateResult = DB::update('UPDATE products SET category_id = ?, name = ?, price = ?, descripton = ?, stock = ?, picture = CAST(? AS varbinary(max)) WHERE id = ?', [$category_id, $name, $price, $description, $stock, $encodedImage, $id]);

            } else {
                $updateResult = DB::update('UPDATE products SET category_id = ?, name = ?, price = ?, descripton = ?, stock = ? WHERE id = ?', [$category_id, $name, $price, $description, $stock, $id]);

            }

            if ($updateResult > 0) {
                // Update successful
                $updatedProduct = DB::select('SELECT * FROM products WHERE (id = ?)', [$id]);
                return response([
                    "code" => "201",
                    "message" => "Product successfully updated",
                    "data" => $updatedProduct
                ]);
            } else {
                // Update failed
                return response([
                    "code" => "501",
                    "message" => "Product update failed",
                    "data" => null
                ]);
            }
        } else {
            return response([
                "code" => "501",
                "message" => "Product not found",
                "data" => null
            ]);
        }
    }

    function isBase64Encoded($data)
    {
        $decoded = base64_decode($data, true);
        if ($decoded !== false) {
            $encoding = mb_detect_encoding($decoded);
            return $encoding === false ? false : true;
        }
        return false;
    }

    public function delete($id){

        $existingProduct = DB::select('SELECT * FROM products WHERE (id = ?)', [intval($id) ]);

        if ($existingProduct) {
            // Product exists, proceed with the deletion
            $deleteResult = DB::delete('DELETE FROM products WHERE id = ?', [intval($id)]);

            if ($deleteResult > 0) {
                // Deletion successful
                return response([
                    "code" => "200",
                    "message" => "Product successfully deleted",
                    "data" => null
                ]);
            } else {
                // Deletion failed
                return response([
                    "code" => "501",
                    "message" => "Product deletion failed",
                    "data" => $existingProduct[0]
                ]);
            }
        } else {
            // User not found
            return response([
                "code" => "501",
                "message" => "Product not found",
                "data" => null
            ]);
        }

    }


}
