<script setup>
import MarkdownIt from "markdown-it"
import MarkdownItAbbr from "markdown-it-abbr"
import MarkdownItFootnote from "markdown-it-footnote"
import MarkdownItHighlightjs from "markdown-it-highlightjs"
import MarkdownItSub from "markdown-it-sub"
import MarkdownItSup from "markdown-it-sup"
import MarkdownItTasklists from "markdown-it-task-lists"
import MarkdownItTOC from "markdown-it-toc-done-right"
import markdownItClass from "@toycode/markdown-it-class"

const mapping = {
    h1: ['text-4xl', 'text-red-400', 'font-bold'],
    p: ['text-red-400', 'font-bold'],
    a: ['text-blue-300', 'hover:underline'],
};

const markdown = new MarkdownIt({
        html: true,
        linkify: true,
    })
    .use(markdownItClass, { mapping })
    .use(MarkdownItAbbr)
    .use(MarkdownItFootnote)
    .use(MarkdownItHighlightjs)
    .use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItTasklists)
    .use(MarkdownItTOC)
</script>

<script>
export default {
    name: "MarkdownRenderer",

    props: {
        source: {
            type: String,
            required: true,
        },
    },
}
</script>

<template>
    <div v-html="markdown.render(source)" />
</template>
