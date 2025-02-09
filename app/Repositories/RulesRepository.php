<?php

namespace App\Repositories;

use App\DTOs\Rule;
use Illuminate\Support\Collection;

class RulesRepository
{
    /**
     * @return Collection<Rule>
     */
    public function getRules(): Collection
    {
        // collection of Rule
        // List of rules = all files in storage_path('rules')
        // key => filename (complete with extension)
        // value => file content

    }
}
