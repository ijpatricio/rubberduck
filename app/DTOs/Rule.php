<?php

namespace App\DTOs;

readonly class Rule
{
    public function __construct(
        public string $key,
        public string $contents,
    ){}
}
