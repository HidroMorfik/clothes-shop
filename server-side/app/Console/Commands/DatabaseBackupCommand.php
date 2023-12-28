<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class DatabaseBackupCommand extends Command
{
    protected $signature = 'backup:database';
    protected $description = 'Backup the entire database';

    public function handle()
    {
        $date = now()->format('Y-m-d_His');
        $fileName = "backup_$date.sql";

        $command = [
            'sqlcmd',
            '-S', config('database.connections.sqlsrv.host'),
            '-d', config('database.connections.sqlsrv.database'),
            '-U', config('database.connections.sqlsrv.username'),
            '-P', config('database.connections.sqlsrv.password'),
            '-Q', "BACKUP DATABASE " . config('database.connections.sqlsrv.database') . " TO DISK='" . storage_path("app/backups/$fileName") . "'"
        ];


        $process = new Process($command);
        $process->run();

        if (!$process->isSuccessful()) {
            $this->error('Database backup failed.');
            throw new ProcessFailedException($process);
        }

        $this->info('Database backup successful.');
    }
}
