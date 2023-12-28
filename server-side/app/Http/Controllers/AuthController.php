<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
;

class AuthController extends Controller
{
    public function login(Request $request){

        $email = $request->input("email");
        $password = md5($request->input("password"));

        $user = DB::select("SELECT id , name, surname, email, role, zip, created_at, updated_at FROM users WHERE email = ? AND password = ?", [$email, $password]);


        if ($user) {
            $selectCurrentSession = DB::select('SELECT * FROM sessions WHERE user_id = ?',[$user[0]->id]);
            if ($selectCurrentSession){
                DB::delete('DELETE FROM sessions WHERE user_id = ?', [$user[0]->id]);
            }

            $uuid = Str::uuid()->toString();
            $expiredAt = now()->addMinute(1);
            $createdSession = DB::insert("INSERT INTO sessions (sess_id, user_id, expired_at) VALUES (?, ?, ?)", [$uuid, $user[0]->id, $expiredAt]);
            if ($createdSession){
                $selectsess_id = DB::select('SELECT sess_id FROM sessions WHERE user_id = ?',[$user[0]->id]);
                return response()->json([
                    "user" => $user[0],
                    "token" => $selectsess_id[0]->sess_id,
                    "message" => "User logged in successfully"
                ],201);
            }
            else
                return response()->json([
                    "message" => "User login failed"
                ],501);

        } else {
            return response()->json([
                "message" => "Invalid credentials",
            ],401);
        }
    }





    public function logout(Request $request)
    {
        $sess_id = $request->input('sess_id');

        $selectSession = DB::select("SELECT * FROM sessions WHERE sess_id = ?", [$sess_id]);
        if ($selectSession){
            $deleteSession = DB::delete('DELETE FROM sessions WHERE sess_id = ?', [$sess_id]);
            if($deleteSession > 0){
                return response([
                    "code" => "201",
                    "message" => "User logged out successfully",
                    "data" => null
                ]);
            }else{
                return response([
                    "code" => "500",
                    "message" => "User logout failed",
                    "data" => null
                ]);
            }
        }

    }
}
