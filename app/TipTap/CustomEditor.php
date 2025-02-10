<?php

namespace App\TipTap;

use Tiptap\Editor;

/**
 * Note: This is a custom editor that extends the default editor.
 * Because the default editor doesn't allow to provide/replace
 * a text serializer, we need to create it by our own means.
 */
class CustomEditor extends Editor
{
    public function getText($configuration = []): string
    {
        return (new CustomTextSerializer($this->schema, $configuration))
            ->process($this->document);
    }
}
