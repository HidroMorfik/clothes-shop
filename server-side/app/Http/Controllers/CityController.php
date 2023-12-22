<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CityController extends Controller
{

    public function index(){
        $cities =  DB::select(
            'SELECT * FROM cities'
        );

        return response([
            "code" => "201",
            "message" => "all cities successfully indexed",
            "data" => $cities
        ]);

    }

    public function show($id){
        $city =  DB::select(
            'SELECT * FROM cities WHERE (zip_code = ?)', [$id]
        );

        if($city != [])
            return response([
                "code" => "201",
                "message" => "city successfully showed",
                "data" => $city
            ]);
        else
            return response([
                "code" => "501",
                "message" => "city not found",
                "data" => null
            ]);
    }

    public function store(Request $request){

        $this->validate($request, [
            "zip_code" => "required|unique:cities",
            "city" => "required|unique:cities",
        ]);

        $zip_code = $request->input('zip_code');
        $city = $request->input('city');

        $is_created = DB::insert('INSERT INTO cities (zip_code, city) VALUES (?, ?)', [$zip_code, $city]);

        if ($is_created == true){
            $city = DB::select('SELECT * FROM cities WHERE (zip_code = ?)',[$zip_code]);
            return response([
                "code" => "201",
                "message" => "city successfully created",
                "data" => $city
            ]);
        }
        else
            return response([
                "code" => "501",
                "message" => "city can't create",
                "data" => null
            ]);
    }

    public function update(Request $request, $id){


        $existingCity = DB::select('SELECT * FROM cities WHERE (zip_code = ?)', [intval($id) ]);

        if ($existingCity) {
            // User exists, proceed with the update
            $zip_code = $request->input('zip_code') ?? $existingCity[0]->zip_code;
            $city = $request->input('city') ?? $existingCity[0]->city;

            // Update user information
            $updateResult = DB::update('UPDATE cities SET zip_code = ?, city = ? WHERE zip_code = ?', [$zip_code, $city, $id]);

            if ($updateResult > 0) {
                // Update successful
                $updatedCity = DB::select('SELECT * FROM cities WHERE (zip_code = ?)', [$zip_code]);
                return response([
                    "code" => "201",
                    "message" => "City successfully updated",
                    "data" => $updatedCity
                ]);
            } else {
                // Update failed
                return response([
                    "code" => "501",
                    "message" => "City update failed",
                    "data" => null
                ]);
            }
        } else {
            return response([
                "code" => "501",
                "message" => "City not found",
                "data" => null
            ]);
        }
    }


    public function delete($id){

        $existingCity = DB::select('SELECT * FROM cities WHERE (zip_code = ?)', [intval($id) ]);

        if ($existingCity) {
            // User exists, proceed with the deletion
            $deleteResult = DB::delete('DELETE FROM cities WHERE zip_code = ?', [intval($id)]);

            if ($deleteResult > 0) {
                // Deletion successful
                return response([
                    "code" => "200",
                    "message" => "City successfully deleted",
                    "data" => null
                ]);
            } else {
                // Deletion failed
                return response([
                    "code" => "501",
                    "message" => "City deletion failed",
                    "data" => $existingCity[0]
                ]);
            }
        } else {
            // User not found
            return response([
                "code" => "501",
                "message" => "City not found",
                "data" => null
            ]);
        }

    }

}
