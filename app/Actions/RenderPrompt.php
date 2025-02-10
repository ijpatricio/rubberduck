<?php

namespace App\Actions;

use Illuminate\Support\Collection;
use Exception;
use Tiptap\Core\DOMParser;
use Tiptap\Core\DOMSerializer;
use Tiptap\Core\JSONSerializer;
use Tiptap\Core\Schema;
use Tiptap\Core\TextSerializer;
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

        // Transform BlockNote format to Tiptap format
        $tiptapDocument = [
            'type' => 'doc',
            'content' => $this->transformBlockNoteToTiptap($blockNoteDocument)
        ];

        $editor = new Editor();

        ray(
            $blockNoteDocument,
            $editor,
            $editor->setContent($tiptapDocument)->getText(),
        )->expandAll();

    }

    protected function transformBlockNoteToTiptap(array $blocks): array
    {
        return array_map(function ($block) {
            $tiptapNode = [
                'type' => $this->mapBlockType($block['type']),
            ];

            if (!empty($block['content'])) {
                $tiptapNode['content'] = array_map(function ($content) {
                    if ($content['type'] === 'text') {
                        return [
                            'type' => 'text',
                            'text' => $content['text']
                        ];
                    } elseif ($content['type'] === 'mention') {
                        return [
                            'type' => 'text',
                            'text' => $content['props']['title']
                        ];
                    }
                    return null;
                }, $block['content']);

                // Filter out null values
                $tiptapNode['content'] = array_filter($tiptapNode['content']);
            }

            return $tiptapNode;
        }, $blocks);
    }

    protected function mapBlockType(string $blockNoteType): string
    {
        $typeMap = [
            'paragraph' => 'paragraph',
            // Add more mappings as needed
        ];

        return $typeMap[$blockNoteType] ?? 'paragraph';
    }
}
