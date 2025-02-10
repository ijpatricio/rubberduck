<?php

namespace App\TipTap;

use Tiptap\Core\Node;
use Tiptap\Utils\HTML;

class MentionNode extends Node
{
    public static $name = 'mention';

    public function addOptions()
    {
        return [
            'HTMLAttributes' => [],
            'renderLabel' => fn () => null,
        ];
    }

    public function parseHTML()
    {
        return [
            [
                'tag' => 'span[data-type="' . self::$name . '"]',
            ],
        ];
    }

    public function addAttributes()
    {
        return [
            'id' => [
                'parseHTML' => fn ($DOMNode) => $DOMNode->getAttribute('data-id') ?: null,
                'renderHTML' => fn ($attributes) => ['data-id' => $attributes->id ?? null],
            ],
        ];
    }

    public function renderHTML($node, $HTMLAttributes = [])
    {
        ray($node)->blue();

        // Here we can add some custom logic to render the node, to the chat history, when we get there
        dd($node);

        return [
            'span',
            HTML::mergeAttributes(
                ['data-type' => self::$name],
                $this->options['HTMLAttributes'],
                $HTMLAttributes,
            ),
            0,
        ];
    }
}
