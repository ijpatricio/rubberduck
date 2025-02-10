<?php

namespace App\Actions;

use App\TipTap\CustomEditor;
use App\TipTap\MentionNode;
use Tiptap\Extensions\StarterKit;

class RenderPrompt
{
    protected $document;

    public $schema;

    public $configuration = [
        'content' => null,
        'extensions' => [],
    ];

    public function __invoke(array $blockNoteDocument)
    {
        $tiptapDocument = [
            'type' => 'doc',
            'content' => $blockNoteDocument,
        ];

        $editor = new CustomEditor([
            'extensions' => [
                new StarterKit,
                new MentionNode,
            ],
        ]);

        ray(
            $editor->setContent($tiptapDocument)->getText(),
        )->expandAll();
    }
}
