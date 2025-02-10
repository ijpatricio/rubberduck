<?php

namespace App\Actions;

use Stevebauman\Hypertext\Transformer;

class RenderPrompt
{
    public function __invoke(string $blockNoteHTML)
    {

        $converter = new BlockToMarkdownConverter();
        $markdown = $converter->convert($blockNoteHTML);

        dd($blockNoteHTML, $markdown);

    }
}
