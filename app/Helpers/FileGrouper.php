<?php

namespace App\Helpers;

use App\DTOs\FileInfo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use SplFileInfo;

class FileGrouper
{
    /**
     * Return a string representation of a group of files, in a way so the LLM can understand.
     *
     * @param Collection<SplFileInfo> $files
     * @return string
     */
    public static function groupFiles(Collection $files): string
    {
        $filesCompiled = $files->map(function (\SplFileInfo $file) {

            $pathInProject = str_replace(base_path('/'), '', $file->getRealPath());

            $contents = File::get($file->getRealPath());

            return new FileInfo(
                $pathInProject,
                $contents,
            );
        });

        return $filesCompiled->map(function (FileInfo $file) {
            return sprintf(
                "\n<File Start: %s> \n %s \n<End File: %s>\n",
                $file->path,
                $file->contents,
                $file->path,
            );
        })->implode("\n");
    }
}
