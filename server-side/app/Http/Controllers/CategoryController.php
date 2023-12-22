<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    public function index(){
        $categories =  DB::select(
            'SELECT * FROM categories'
        );

        return response([
            "code" => "201",
            "message" => "all categories successfully indexed",
            "data" => $categories
        ]);
    }

    public function show($id){
        $category =  DB::select(
            'SELECT * FROM categories WHERE (id = ?)', [$id]
        );

        if($category != [])
            return response([
                "code" => "201",
                "message" => "category successfully showed",
                "data" => $category
            ]);
        else
            return response([
                "code" => "501",
                "message" => "category not found",
                "data" => null
            ]);
    }

    public function store(Request $request){

        $this->validate($request, [
            "name" => "required",
        ]);

        $name = $request->input('name');
        $is_created = DB::insert('INSERT INTO categories (name) VALUES (?)', [$name]);

        if ($is_created == true){
            $category = DB::select('SELECT * FROM categories WHERE (name = ?)',[$name]);
            return response([
                "code" => "201",
                "message" => "Category successfully created",
                "data" => $category
            ]);
        }
        else
            return response([
                "code" => "501",
                "message" => "Category can't create",
                "data" => null
            ]);
    }

    public function update(Request $request, $id){


        $existingCategory = DB::select('SELECT * FROM categories WHERE (id = ?)', [intval($id) ]);

        if ($existingCategory) {
            $name = $request->input('name') ?? $existingCategory[0]->name;

            $updateResult = DB::update('UPDATE categories SET name = ? WHERE id = ?', [$name,  $id]);

            if ($updateResult > 0) {
                // Update successful
                $updatedCategory = DB::select('SELECT * FROM categories WHERE (id = ?)', [$id]);
                return response([
                    "code" => "201",
                    "message" => "Category successfully updated",
                    "data" => $updatedCategory
                ]);
            } else {
                // Update failed
                return response([
                    "code" => "501",
                    "message" => "Category update failed",
                    "data" => null
                ]);
            }
        } else {
            return response([
                "code" => "501",
                "message" => "Category not found",
                "data" => null
            ]);
        }
    }


    public function delete($id){

        $existingCategory = DB::select('SELECT * FROM categories WHERE (id = ?)', [intval($id) ]);

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
        } else {
            return response([
                "code" => "501",
                "message" => "Category not found",
                "data" => null
            ]);
        }

    }



}
