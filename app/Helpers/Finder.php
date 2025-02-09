<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use Symfony\Component\Finder\Finder as SymfonyFinder;

class Finder
{
    /**
     * @param string $directory
     * @param array<string> $ignore
     * @return Collection
     */
    public static function find(string $directory, array $ignore): Collection
    {
        $finder = SymfonyFinder::create()
            ->files()
            ->in($directory)
            ->sortByName();

        // Exclude directories
        foreach ($ignore as $path) {
            $finder->exclude($path);
        }

        // Also ignore files directly in the root that match these names
        // (exclude() only works for directories)
        foreach ($ignore as $path) {
            $finder->notPath($path);
        }

        $arr = iterator_to_array(
            iterator: $finder,
            preserve_keys: false,
        );

        return collect($arr);
    }
}
