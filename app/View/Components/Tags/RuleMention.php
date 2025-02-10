<?php

namespace App\View\Components\Tags;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class RuleMention extends Component
{
    public string $contents;

    /**
     * Create a new component instance.
     */
    public function __construct(
        public string $title,
        public string $value,
    )
    {
        $path = storage_path('app/rules/' . $this->value);

        if(\File::exists($this->value)) {
            throw new \Exception("File [{$path}] not found");
        }

        $this->contents = \File::get($path);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.tags.rule-mention', [
            'contents' => $this->contents,
        ]);
    }
}
