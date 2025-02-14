<?php

namespace App\Livewire;

use App\Actions\GetFilesList;
use App\Actions\GetRulesList;
use App\Actions\GetScopeList;
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

    public string $promptType;

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
        <div class="skeleton h-46 w-full"></div>
        HTML;
    }

    public function mingleData(): array
    {
        return [
            //
        ];
    }

    #[Renderless]
    public function findFiles($query, $basePath, GetFilesList $getFilesList): array
    {
        return $getFilesList($query, $basePath)
            ->toArray();
    }

    #[Renderless]
    public function findRules($query, GetRulesList $getRulesList): array
    {
        return $getRulesList($query)
            ->toArray();
    }

    #[Renderless]
    public function findScopes($query, $basePath, GetScopeList $getScopeList): array
    {
        return $getScopeList($query, $basePath)
            ->toArray();
    }
}
