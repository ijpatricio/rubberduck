<?php

namespace App\Actions;

use App\DTOs\Rule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Symfony\Component\Finder\SplFileInfo;

class GetRulesList
{
    /**
     * @return Collection<Rule>
     */
    public function __invoke(string $query): Collection
    {
        $rulesPath = storage_path('app/rules');

        // Get all files from the rules directory
        $files = collect(File::allFiles($rulesPath));

        return $files
            ->map(function (SplFileInfo $file) {

                $filename = $file->getFilename();

                return $filename;
            })->filter(function (string $file) use ($query) {

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
