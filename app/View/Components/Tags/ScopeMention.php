<?php

namespace App\View\Components\Tags;

use App\RubberDuck;
use Closure;
use File;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Symfony\Component\Finder\SplFileInfo;

class ScopeMention extends Component
{
    public Collection $files;

    /**
     * Create a new component instance.
     */
    public function __construct(
        public string $title,
        public string $value,
    )
    {
        $projectBasePath = app()->make(RubberDuck::PROJECT_PATH);

        $configFilePath = $projectBasePath . '/' . config('rubberduck.config-filename');

        if (!File::exists($configFilePath)) {
            throw new \Exception("File [{$configFilePath}] not found");
        }

        $config = File::json($configFilePath);

        $scope = collect(data_get($config, 'scopes.*'))
            ->first(fn($scope) => $scope['key'] === $this->value);

        $folders = collect(data_get($scope, 'folders', []));

        $this->files = $folders
            ->flatMap(function ($folder) use ($projectBasePath) {
                return File::allFiles($projectBasePath . '/' . $folder);
            })
            ->map(function (SplFileInfo $file) {
                return $file->getPathname();
            })
            ->filter()
            ->values();
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.tags.scope-mention', [
            'files' => $this->files,
        ]);
    }
}
