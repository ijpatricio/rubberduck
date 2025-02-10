<template>
    <div>
        <div class="mt-2 flex flex-col gap-2">
            <div class="mr-10">
                Use cached response
                <input v-model="useCache" type="checkbox" checked="checked" class="toggle toggle-sm"/>
            </div>
            <div>
                <button class="btn btn-primary btn-sm" @click="demo">
                    Ask AI
                </button>
            </div>
        </div>

        <MarkdownRenderer class="mt-10" :source="streamedResponse"/>

        <div class="mt-4 flex items-center gap-2">
            <button @click="saveResponse" class="btn btn-primary btn-outline btn-sm">
                Cache current response
            </button>
        </div>

        <div>
            <pre>{{ JSON.stringify(promptStore.systemPrompt) }}</pre>
        </div>
        <div>
            <pre>{{ JSON.stringify(promptStore.newMessage) }}</pre>
        </div>
    </div>
</template>

<script>
import MarkdownRenderer from "./MarkdownRenderer.vue"
import Anthropic from "@anthropic-ai/sdk"
import {usePromptStore} from "../stores/usePromptStore.js";
export default {
    components: {
        MarkdownRenderer,
    },
    props: {
        wire: Object,
        mingleData: Object,
    },
    data: () => ({
        useCache: true,
        streamedResponse: '', // Add this to store the streaming response
    }),
    setup() {
        const promptStore = usePromptStore()

        return {
            promptStore,
        }
    },
    mounted() {
        // this.streamedResponse = localStorage.getItem('streamedResponse') || ''

        window.Livewire.on('promptUpdated', ({promptType, document}) => {
            if (promptType === 'systemPrompt') {
                this.promptStore.systemPrompt = document
            } else {
                this.promptStore.newMessage = document
            }
        })
    },
    methods: {
        saveResponse() {
            localStorage.setItem('streamedResponse', this.streamedResponse)
        },
        async demo() {

            if (this.useCache) {
                this.streamedResponse = localStorage.getItem('streamedResponse')
                return
            }
            // Reset the streamed response
            this.streamedResponse = ''

            const anthropic = new Anthropic({
                apiKey: this.mingleData['api_key'],
                dangerouslyAllowBrowser: true,
            })

            // Create a streaming message
            const stream = await anthropic.messages.create({
                model: this.mingleData.model,
                max_tokens: 4096,
                temperature: 0,
                system: "Act as a successful developer that has over 20 years of experience, at designing web applications, using all CMS in the world, and a lot of publishing experience across many generalist and niche topics.",
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Make a list of the TALL stack components. Show some code examples."
                            }
                        ]
                    }
                ],

                // Enable streaming
                stream: true,
            })

            // Process the stream
            try {
                for await (const messageChunk of stream) {
                    if (messageChunk.type === 'content_block_delta') {
                        this.streamedResponse += messageChunk.delta.text
                    }
                }
            } catch (error) {
                console.error('Streaming error:', error)
            }
        },
    },
}
</script>
