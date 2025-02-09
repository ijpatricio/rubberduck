<?php

namespace App\Livewire;

use App\Helpers\Finder;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Livewire\Attributes\Renderless;
use Livewire\Component;
use Symfony\Component\Finder\SplFileInfo;

class PromptEditor extends Component implements HasMingles
{
    use InteractsWithMingles;

    public string $basePath;

    public function component(): string
    {
        return 'resources/js/PromptEditor/index.js';
    }

    public function mount()
    {
        // This is going to be coming from Database model
        // And, App is local, 1 user, so it's fine to use env
        /** @noinspection LaravelFunctionsInspection */
        $this->basePath = env('PROJECT_BASE_PATH');
    }

    public function mingleData(): array
    {
        return [
            //
        ];
    }

    #[Renderless]
    public function findFiles($query, $basePath): array
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
            ->filter(function ($file) use ($query) {

                // If no search, return all files
                if (blank($query)) {
                    return true;
                }

                return str($file)->lower()->contains(
                    str($query)->lower()
                );
            })
            ->toArray();
    }
}
