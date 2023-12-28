<?php

namespace App\Http\Controllers;

use App\Helpers\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DatabaseBackupController extends Controller
{
    public function index(Request $request){

        if (User::isAdmin($request->header("sess_id"))){
            $backups = DB::select("SELECT * FROM backups");
            return response()->json([
                'message' => 'Backups indexed successfully',
                'data' => $backups
            ],201);
        }else
            return response()->json(['message' => 'Yetkisiz Islem'], 403);

        }
    public function backup(Request $request)
    {
        if (User::isAdmin($request->input("sess_id"))){
            try {
                DB::insert("INSERT INTO backups (file_name) VALUES (?) ",[$request->input("file_name")]);
                Db::select("EXEC BackupDatabase ?", [$request->input("file_name")]);
                return response()->json(['message' => 'Backup completed successfully']);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Backup failed: ' . $e->getMessage()], 500);
            }
        } else return response()->json(['message' => 'Yetkisiz Islem'], 403);
    }

    public function restore(Request $request)
    {
        if (User::isAdmin($request->input("sess_id"))){
            try {
                DB::statement("USE master");
                DB::statement("ALTER DATABASE VTYSCalisma SET SINGLE_USER WITH ROLLBACK IMMEDIATE");
                DB::select("EXEC RestoreDatabase ?", [$request->input("backup")]);
                DB::statement("ALTER DATABASE VTYSCalisma SET MULTI_USER");
                return response()->json(['message' => 'Restore completed successfully']);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Restore failed: ' . $e->getMessage()], 500);
            }
        } else return response()->json(['message' => 'Yetkisiz Islem'], 403);
    }
}
