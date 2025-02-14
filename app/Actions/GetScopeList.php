<?php

namespace App\Actions;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

class GetScopeList
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

        $configFilePath = $basePath . '/' . config('rubberduck.config-filename');

        try {
            $config = File::json($configFilePath);
        } catch (\Exception $e) {
            dd($e);
        }

        return collect(
            data_get($config, 'scopes.*')
        );
    }
}
