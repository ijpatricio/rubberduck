<?php

namespace App\Livewire;

use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Attributes\Lazy;
use Livewire\Component;

#[Lazy]
class Talk extends Component implements HasMingles
{
    use InteractsWithMingles;

    public function component(): string
    {
        return 'resources/js/Talk/index.js';
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div class="skeleton h-56 w-full"></div>
        HTML;
    }

    public function mingleData(): array
    {
        return [
            'api_key' => config('services.anthropic.api_key'),
            'model' => config('services.anthropic.model'),
        ];
    }

    public function preparePrompts()
    {

    }
}
