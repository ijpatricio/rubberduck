<?php

namespace App\View\Components\Tags;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FileMention extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.tags.file-mention');
    }
}
