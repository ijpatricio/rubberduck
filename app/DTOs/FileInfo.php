<?php

namespace App\DTOs;

readonly class FileInfo
{
    public function __construct(
        public string $path,
        public string $contents,
    ){}
}
