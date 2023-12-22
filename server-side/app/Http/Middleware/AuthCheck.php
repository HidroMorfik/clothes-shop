<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthCheck
{
    public function handle(Request $request, Closure $next)
    {
        $sess_id = $request->input('sess_id') ?? $request->header('sess_id');
        $selectSession = DB::select('SELECT * FROM sessions WHERE sess_id = ?', [$sess_id]);
        if (!$selectSession)
            return response([
                "code" => "401",
                "message" => "Unauthorized",
                "data" => null
            ], 401);

        return $next($request);
    }
}
