<?php

namespace App\Livewire;

use App\Actions\RenderPrompt;
use App\RubberDuck;
use Ijpatricio\Mingle\Concerns\InteractsWithMingles;
use Ijpatricio\Mingle\Contracts\HasMingles;
use Livewire\Attributes\Lazy;
use Livewire\Component;

#[Lazy]
class Talk extends Component implements HasMingles
{
    use InteractsWithMingles;

    public string $basePath;

    public function component(): string
    {
        return 'resources/js/Talk/index.js';
    }

    public function mount()
    {
        // This is going to be coming from Database model
        // And, App is local, 1 user, so it's fine to use env
        /** @noinspection LaravelFunctionsInspection */
        $this->basePath = env('PROJECT_BASE_PATH');

        $this->setGlobals();
    }

    public function hydrate()
    {
        $this->setGlobals();
    }

    private function setGlobals()
    {
        app()->bind(RubberDuck::PROJECT_PATH, fn() => $this->basePath);
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

    public function renderPrompt($blockNoteDocument, RenderPrompt $renderPrompt)
    {
        return $renderPrompt($blockNoteDocument);
    }
}
