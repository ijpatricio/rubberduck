<?php

namespace App\Actions;

use App\Helpers\Finder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Symfony\Component\Finder\SplFileInfo;

class GetFilesList
{
    /**
     * @return Collection<string>
     */
    public function __invoke(string $query, string $basePath): Collection
    {
        if (!File::exists($basePath)) {
            dd("The configured Path [{$basePath}] does not exist!");
        }

        $basePath = str($basePath)->finish('/');

        $files = collect(
            Finder::find(
                $basePath,
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

        return $files
            ->map(
                fn(SplFileInfo $file) => str($file->getRealPath())
                    ->replace($basePath, '')
                    ->value()
            )
            ->filter(function (string $file) use ($query) {

                // If no search, return all files
                if (blank($query)) {
                    return true;
                }

                $shouldKeep = str($file)->lower()->contains(
                    str($query)->lower()->value()
                );

                return $shouldKeep;
            })
            ->values();
    }
}
