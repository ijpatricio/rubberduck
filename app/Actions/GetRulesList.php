<?php

namespace App\Actions;

use App\DTOs\Rule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class GetRulesList
{
    /**
     * @return Collection<Rule>
     */
    public function __invoke(): Collection
    {
        $rulesPath = storage_path('rules');
        
        // Get all files from the rules directory
        $files = collect(glob($rulesPath . '/*'));

        dd($files);
        
        return $files->mapWithKeys(function ($filePath) {
            $filename = basename($filePath);
            $content = file_get_contents($filePath);
            
            return [
                $filename => new Rule(
                    name: $filename,
                    content: $content
                )
            ];
        });
    }
}
