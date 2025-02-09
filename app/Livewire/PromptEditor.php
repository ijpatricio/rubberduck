<?php

namespace App\Livewire;

use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Component;

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

    public function doubleIt($amount)
    {
        return $amount * 2;
    }
}
