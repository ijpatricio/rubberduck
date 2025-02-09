<script setup>
import MarkdownIt from "markdown-it"
import MarkdownItAbbr from "markdown-it-abbr"
import MarkdownItFootnote from "markdown-it-footnote"
import MarkdownItHighlightjs from "markdown-it-highlightjs"
import MarkdownItSub from "markdown-it-sub"
import MarkdownItSup from "markdown-it-sup"
import MarkdownItTasklists from "markdown-it-task-lists"
import MarkdownItTOC from "markdown-it-toc-done-right"

const markdown = new MarkdownIt()
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
    <div class="w-full flex justify-between gap-4">
        <div class="border p-2 rounded-lg typography" v-html="markdown.render(source)" />
        <div class="border p-2 rounded-lg whitespace-pre-wrap" v-text="source" />
    </div>
</template>
