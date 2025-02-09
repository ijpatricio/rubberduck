<?php

namespace App\Console\Commands;

use App\Helpers\Finder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\File;
use App\DTOs\FileInfo;

class ScavengeProject extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scavenge-project {path?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scavenge a project for files and directories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $relativePath = $this->argument('path');

        $files = collect(
            Finder::find(
                base_path(str($relativePath)->start('/')),
                [
                    'node_modules',
                    'vendor',
                    '.git',
                    '.idea',
                    '.vscode',
                    'public',
                    'storage',
                    'tests',
                ]
            )
        );

        dd($files->map(fn($file) => str_replace(base_path('/'), '', $file->getRealPath())));

        $filesCompiled = $files->map(function (\SplFileInfo $file) {

            $pathInProject = str_replace(base_path('/'), '', $file->getRealPath());

            $contents = File::get($file->getRealPath());

            return new FileInfo(
                $pathInProject,
                $contents,
            );
        });

        $filesSourceCompilation = $filesCompiled->map(function (FileInfo $file) {
            return sprintf(
                "\n<File Start: %s> \n %s \n<End File: %s>\n",
                $file->path,
                $file->contents,
                $file->path,
            );
        })->implode("\n");


        $this->output->writeln(
            Blade::render(
                File::get(resource_path('prompts/initial.blade.php'))
            )
        );

        $this->output->writeln($filesSourceCompilation);
    }
}
