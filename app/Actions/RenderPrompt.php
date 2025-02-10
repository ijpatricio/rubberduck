<?php

namespace App\Actions;

use App\TipTap\CustomEditor;
use App\TipTap\CustomTextSerializer;
use App\TipTap\MentionNode;
use Tiptap\Editor;
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
        ray()->clearAll();

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
//            $blockNoteDocument,
//            $editor,
        )->expandAll();
    }
}
