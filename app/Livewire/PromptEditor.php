<?php

namespace App\Livewire;

use App\DTOs\FileInfo;
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
            'message' => 'Message in a bottle  PromptEditor 🍾',
        ];
    }

    #[Renderless]
    public function findFile($query): Collection
    {
        return collect(File::allFiles(base_path()))
            ->filter(fn(SplFileInfo $file) => str($file->getRealPath())
                ->replace(base_path('/'), '')
                ->contains($query))
            ->map(function (SplFileInfo $file) {

                $pathInProject = str_replace(base_path('/'), '', $file->getRealPath());

                $contents = File::get($file->getRealPath());

                return new FileInfo(
                    $pathInProject,
                    $contents,
                );
            });
    }
}
