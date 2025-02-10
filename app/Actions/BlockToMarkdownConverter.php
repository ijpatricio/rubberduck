<?php

namespace App\Actions;

use DOMDocument;
use DOMElement;
use DOMXPath;

class BlockToMarkdownConverter
{
    private DOMDocument $dom;
    private DOMXPath $xpath;
    private bool $inList = false;
    private string $currentListType = '';

    public function convert(string $html): string
    {
        $this->dom = new DOMDocument();
        $this->dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $this->xpath = new DOMXPath($this->dom);

        return $this->processBlockGroup();
    }

    private function processBlockGroup(): string
    {
        $markdown = '';
        $blocks = $this->xpath->query("//div[contains(@class, 'bn-block-outer')]");

        foreach ($blocks as $block) {
            $content = $this->processBlock($block);

            // Handle list continuity
            $isListItem = str_contains($content, '- ') || str_contains($content, '1. ');
            if (!$isListItem && $this->inList) {
                $this->inList = false;
                $markdown .= "\n";
            }

            $markdown .= $content . "\n";
        }

        return trim($markdown);
    }

    private function processBlock(DOMElement $block): string
    {
        $content = $this->xpath->query(".//div[contains(@class, 'bn-block-content')]", $block)->item(0);

        if (!$content) {
            return '';
        }

        $contentType = $content->getAttribute('data-content-type');

        return match ($contentType) {
            'heading' => $this->processHeading($content),
            'bulletListItem' => $this->processBulletListItem($content),
            'numberListItem' => $this->processNumberListItem($content),
            'paragraph' => $this->processParagraph($content),
            default => ''
        };
    }

    private function processHeading(DOMElement $content): string
    {
        $heading = $this->xpath->query(".//h1|.//h2|.//h3|.//h4|.//h5|.//h6", $content)->item(0);
        if (!$heading) {
            return '';
        }

        $level = (int) substr($heading->nodeName, 1);
        $text = $heading->textContent;

        return str_repeat('#', $level) . ' ' . $text;
    }

    private function processBulletListItem(DOMElement $content): string
    {
        $this->inList = true;
        $this->currentListType = 'bullet';
        $text = $this->xpath->query(".//p[contains(@class, 'bn-inline-content')]", $content)->item(0)?->textContent ?? '';
        return "- " . $text;
    }

    private function processNumberListItem(DOMElement $content): string
    {
        $this->inList = true;
        $this->currentListType = 'number';
        $text = $this->xpath->query(".//p[contains(@class, 'bn-inline-content')]", $content)->item(0)?->textContent ?? '';
        return "1. " . $text; // Markdown will handle the numbering automatically
    }

    private function processParagraph(DOMElement $content): string
    {
        $paragraph = $this->xpath->query(".//p[contains(@class, 'bn-inline-content')]", $content)->item(0);

        if (!$paragraph) {
            return '';
        }

        return $this->processParagraphContent($paragraph);
    }

    private function processParagraphContent(DOMElement $paragraph): string
    {
        $spans = $this->xpath->query(".//span", $paragraph);

        if ($spans->length === 0) {
            return $paragraph->textContent;
        }

        $markdown = '';
        foreach ($spans as $span) {
            $type = $span->getAttribute('data-inline-content-type');
            $value = $span->getAttribute('data-value');
            $title = $span->getAttribute('data-title');

            $markdown .= match ($type) {
                'mention' => $this->processMention($span),
                'file' => "@[{$title}]({$value})",
                default => $span->textContent,
            };
        }

        return $markdown;
    }

    private function processMention(DOMElement $span): string
    {
        $type = $span->getAttribute('data-type');
        $title = $span->getAttribute('data-title');
        $value = $span->getAttribute('data-value');

        return match ($type) {
            'rule' => "!rule[{$title}]({$value})",
            'file' => "!file[{$title}]({$value})",
            default => $span->textContent,
        };
    }
}
