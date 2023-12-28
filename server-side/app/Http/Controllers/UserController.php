<?php

namespace App\Http\Controllers;

use App\Helpers\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use http\Exception\BadQueryStringException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use function Symfony\Component\String\s;
use function Symfony\Component\Translation\t;



class UserController extends Controller
{
    /**
     * @throws ValidationException
     */


    public function index(Request $request){
        if (User::isAdmin($request->header("sess_id"))){
            $users =  DB::select(
                'SELECT * FROM users'
            );
            return response()->json([
                "message" => "all users successfully indexed",
                "data" => $users
            ],201);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);
    }

    public function show(Request $request, $id){

        if (User::isAdmin($request->header("sess_id"))){
            $user =  DB::select(
                'SELECT * FROM users WHERE (id = ?)', [$id]
            );

            if($user != [])
                return response()->json([
                    "message" => "user successfully showed",
                    "data" => $user[0]
                ],201);
            else
                return response()->json([
                    "message" => "user not found",
                    "data" => null
                ],401);
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);


    }

    public function store(Request $request){
        $this->validate($request, [
            "name" => "required",
            "email" => "required|email|unique:users",
            "password" => "required",
            "role" => ['required', Rule::in(['admin', 'manager', 'customer'])],
            "zip" => "required"
        ]);

        $name = $request->input('name');
        $surname = $request->input('surname');
        $email = $request->input('email');
        $password = md5($request->input('password'));
        $role = $request->input('role');
        $zip = $request->input('zip');


        if (\App\Helpers\User::isAdmin($request->input("sess_id"))){
            $is_created = DB::insert('INSERT INTO users (name, surname, email, password, role, zip) VALUES (?, ?, ?, ?, ?, ?)', [$name, $surname, $email, $password, $role, $zip]);

            if ($is_created == true){
                $user = DB::select('SELECT name, surname, email, role, zip FROM users WHERE (email = ?)',[$email]);
                return response([
                    "code" => "201",
                    "message" => "user successfully created",
                    "data" => $user
                ]);
            }
            else
                return response([
                    "code" => "501",
                    "message" => "user can't create",
                    "data" => null
                ]);
        }
        else
            return response()->json([
               "message" => "Yetkisiz İslem"
            ],403);

    }

    public function update(Request $request, $id){
        $request->validate([
            "email" => "email",
            "role" => [Rule::in(['admin', 'manager', 'customer'])],
        ]);

        if (User::isAdmin($request->input("sess_id"))){
            $existingUser = DB::select('SELECT * FROM users WHERE (id = ?)', [intval($id) ]);

            if ($existingUser) {
                // User exists, proceed with the update
                $name = $request->input('name') ?? $existingUser[0]->name;
                $surname = $request->input('surname') ?? $existingUser[0]->surname;
                $email = $request->input('email') ?? $existingUser[0]->email;
                $role = $request->input('role') ?? $existingUser[0]->role;
                $zip = $request->input('zip') ?? $existingUser[0]->zip;
                $password = $request->input('password') ? md5($request->input('password')) : $existingUser[0]->password;

                // Update user information
                $updateResult = DB::update(
                    'UPDATE users SET name = ?, surname = ?, email = ?, role = ?, zip = ?, password = ?
                                    WHERE id = ?', [$name, $surname, $email, $role, $zip, $password, $id]);

                if ($updateResult > 0) {
                    // Update successful
                    $updatedUser = DB::select('SELECT * FROM users WHERE (id = ?)', [$id]);
                    return response([
                        "message" => "User successfully updated",
                        "data" => $updatedUser
                    ],201);
                } else {
                    // Update failed
                    return response([
                        "message" => "User update failed",
                        "data" => null
                    ],501);
                }
            } else {
                return response([
                    "message" => "User not found",
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

        if (User::isAdmin($request->header("sess_id"))){
            $existingUser = DB::select('SELECT * FROM users WHERE (id = ?)', [intval($id) ]);

            if ($existingUser) {
                // User exists, proceed with the deletion
                $deleteResult = DB::delete('DELETE FROM users WHERE id = ?', [intval($id)]);

                if ($deleteResult > 0) {
                    // Deletion successful
                    return response([
                        "code" => "200",
                        "message" => "User successfully deleted",
                        "data" => null
                    ]);
                } else {
                    // Deletion failed
                    return response([
                        "code" => "501",
                        "message" => "User deletion failed",
                        "data" => $existingUser[0]
                    ]);
                }
            } else {
                // User not found
                return response([
                    "code" => "501",
                    "message" => "User not found",
                    "data" => null
                ]);
            }
        }
        else
            return response()->json([
                "message" => "Yetkisiz İslem"
            ],403);



    }



}
