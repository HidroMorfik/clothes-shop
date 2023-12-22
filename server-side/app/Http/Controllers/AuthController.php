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

        $user = DB::select("SELECT * FROM users WHERE email = ? AND password = ?", [$email, $password]);

        if ($user) {
            $uuid = Str::uuid()->toString();
            $expiredAt = now()->addMinute(1);
            $createdSession = DB::insert("INSERT INTO sessions (sess_id, user_id, expired_at) VALUES (?, ?, ?)", [$uuid, $user[0]->id, $expiredAt]);
            if ($createdSession){
                $selectsess_id = DB::select('SELECT sess_id FROM sessions WHERE user_id = ?',[$user[0]->id]);
                return response()->json([
                    "code" => "201",
                    "user" => $user[0],
                    "message" => "User logged in successfully",
                    "token" => $selectsess_id
                ]);
            }
            else
                return response()->json([
                    "code" => "501",
                    "message" => "User login failed",
                    "data" => null
                ]);

        } else {
            return response([
                "code" => "401",
                "message" => "Invalid credentials",
                "data" => null
            ]);
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
