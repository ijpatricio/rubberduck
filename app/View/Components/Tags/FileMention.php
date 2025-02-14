<?php

namespace App\View\Components\Tags;

use App\RubberDuck;
use Closure;
use File;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Str;
use Illuminate\View\Component;

class FileMention extends Component
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
        $projectBasePath = app()->make(RubberDuck::PROJECT_PATH);

        $path = $projectBasePath . Str::start($this->value, '/');

        if(! File::exists($path)) {
            throw new \Exception("File [{$path}] not found");
        }

        $this->contents = File::get($path);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.tags.file-mention', [
            'contents' => $this->contents,
            'path' => $this->value,
        ]);
    }
}
