<?php

namespace App\Livewire;

use App\Actions\GetFilesList;
use App\Actions\GetRulesList;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Attributes\Lazy;
use Livewire\Attributes\Renderless;
use Livewire\Component;

#[Lazy]
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

    public function placeholder()
    {
        return <<<'HTML'
        <div class="skeleton h-26 w-full"></div>
        HTML;
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
        $action = app(GetFilesList::class);

        return $action($query, $basePath)
            ->toArray();
    }

    #[Renderless]
    public function findRules($query): array
    {
        $action = app(GetRulesList::class);

        return $action($query)
            ->toArray();
    }
}
