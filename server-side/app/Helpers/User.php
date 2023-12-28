<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class User
{

    public static function isAdmin($sess_id): bool
    {
        $role = DB::select("
            SELECT role FROM users
            WHERE id = (SELECT user_id FROM sessions WHERE sess_id = ?)", [$sess_id]);


        if ($role[0]->role == "admin" || $role == "admin")
            return true;
        else
            return false;
    }


    public static function isManager($sess_id): bool
    {
        $role = DB::select("
            SELECT role FROM users
            WHERE id = (SELECT user_id FROM sessions WHERE sess_id = ?)", [$sess_id]);

        if ($role[0]->role == "customer" || $role == "customer")
            return false;
        else
            return true;
    }


}
