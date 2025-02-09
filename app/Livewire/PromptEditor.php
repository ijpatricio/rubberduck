<?php

namespace App\Livewire;

use App\DTOs\FileInfo;
use App\Helpers\Finder;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Livewire\Attributes\Renderless;
use Livewire\Component;
use SplFileInfo;

class PromptEditor extends Component implements HasMingles
{
    use InteractsWithMingles;

    public function component(): string
    {
        return 'resources/js/PromptEditor/index.js';
    }

    public function mingleData(): array
    {
        return [
            //
        ];
    }

    #[Renderless]
    public function findFile($query, $basePath): Collection
    {
        ray($query, $basePath);

        return collect();

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

        return $files
            ->map(function ($file) {
                return str_replace(base_path('/'), '', $file->getRealPath());
            });
    }
}
