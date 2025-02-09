<?php

namespace App\Actions;

use App\DTOs\Rule;
use Illuminate\Support\Collection;

class GetRulesList
{
    /**
     * @return Collection<Rule>
     */
    public function __invoke(): Collection
    {
        // collection of Rule
        // List of rules = all files in storage_path('rules')
        // key => filename (complete with extension)
        // value => file content

        return collect();
    }
}
