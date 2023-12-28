<?php

namespace App\Http\Controllers;

use App\Helpers\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    public function index(Request $request){
            $categories =  DB::select(
                'SELECT * FROM categories'
            );

            return response([
                "message" => "all categories successfully indexed",
                "data" => $categories
            ],201);
    }

    public function show(Request $request, $id){
            $category =  DB::select(
                'SELECT * FROM categories WHERE (id = ?)', [$id]
            );

            if($category != [])
                return response()->json([
                    "message" => "category successfully showed",
                    "data" => $category[0]
                ],201);
            else
                return response()->json([
                    "message" => "category not found",
                    "data" => null
                ],501);
    }

    public function store(Request $request){

        $this->validate($request, [
            "name" => "required",
        ]);

        if (User::isManager($request->input("sess_id"))){
            $name = $request->input('name');
            $is_created = DB::insert('INSERT INTO categories (name) VALUES (?)', [$name]);

            if ($is_created == true){
                $category = DB::select('SELECT * FROM categories WHERE (name = ?)',[$name]);
                return response()->json([
                    "message" => "Category successfully created",
                    "data" => $category
                ],201);
            }
            else
                return response()->json([
                    "message" => "Category can't create",
                    "data" => null
                ],501);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);


    }

    public function update(Request $request, $id){

        $existingCategory = DB::select('SELECT * FROM categories WHERE (id = ?)', [intval($id) ]);

        if (User::isManager($request->input("sess_id"))){
            if ($existingCategory) {
                $name = $request->input('name') ?? $existingCategory[0]->name;

                $updateResult = DB::update('UPDATE categories SET name = ? WHERE id = ?', [$name,  $id]);

                if ($updateResult > 0) {
                    // Update successful
                    $updatedCategory = DB::select('SELECT * FROM categories WHERE (id = ?)', [$id]);
                    return response()->json([
                        "message" => "Category successfully updated",
                        "data" => $updatedCategory[0]
                    ],201);
                } else {
                    // Update failed
                    return response()->json([
                        "message" => "Category update failed",
                        "data" => null
                    ],501);
                }
            } else
                return response()->json([
                    "message" => "Category not found",
                    "data" => null
                ],401);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);
    }


    public function delete(Request $request, $id){
        $existingCategory = DB::select('SELECT * FROM categories WHERE (id = ?)', [intval($id) ]);

        if (User::isManager($request->input("sess_id"))){
            if ($existingCategory) {
                $deleteResult = DB::delete('DELETE FROM categories WHERE id = ?', [intval($id)]);

                if ($deleteResult > 0) {
                    return response([
                        "code" => "200",
                        "message" => "Category successfully deleted",
                        "data" => null
                    ]);
                } else {
                    return response([
                        "code" => "501",
                        "message" => "Category deletion failed",
                        "data" => $existingCategory[0]
                    ]);
                }
            } else
                return response([
                    "code" => "501",
                    "message" => "Category not found",
                    "data" => null
                ]);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);
    }



}
