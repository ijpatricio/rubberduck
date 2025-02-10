<?php

namespace App\TipTap;

use App\View\Components\Tags\FileMention;
use App\View\Components\Tags\RuleMention;

class CustomTextSerializer
{
    protected $document;

    protected $schema;

    protected $configuration = [
        'blockSeparator' => "\n\n",
    ];

    public function __construct($schema, $configuration = [])
    {
        $this->schema = $schema;
        $this->configuration = array_merge($this->configuration, $configuration);
    }

    public function process(array $value): string
    {
        $html = [];

        // transform document to object
        $this->document = json_decode(json_encode($value));

        $content = is_array($this->document->content) ? $this->document->content : [];

        foreach ($content as $node) {
            $html[] = $this->renderNode($node);
        }

        return join($this->configuration['blockSeparator'], $html);
    }

    private function renderNode($node): string
    {
        $text = [];

        if (isset($node->content)) {
            foreach ($node->content as $nestedNode) {
                $text[] = $this->renderNode($nestedNode);
            }
        } elseif (isset($node->text)) {
            $text[] = $node->text;
        } else {
            $text[] = $this->processCustomNode($node);
        }

        return join($this->configuration['blockSeparator'], $text);
    }

    private function processCustomNode($node): string
    {
        return match ($node->type) {
            'mention' => $this->processMentionNode($node),
            default => throw new \Exception('Unknown node type: ' . $node->type),
        };
    }

    private function processMentionNode($node): string
    {
        $props = fluent($node->props);

        $type = $props->get('type');

        return match ($type) {
            'rule' => $this->renderWith(RuleMention::class, [
                'title' => $props->get('title'),
                'value' => $props->get('value'),
            ]),
            'file' => $this->renderWith(FileMention::class, [
                'title' => $props->get('title'),
                'value' => $props->get('value'),
            ]),
            default => throw new \Exception('Unknown mention type: ' . $type),
        };
    }

    private function renderWith(string $class, array $props)
    {
        $component = new $class(...$props);

        return $component->render()->render();
    }
}
