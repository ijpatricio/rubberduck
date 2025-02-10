<template>
    <div>
        <div class="mt-12">
            <button class="btn btn-primary btn-sm" @click="preparePrompts">
                Prepare Prompts
            </button>
        </div>

        <!-- Prompt text previews -->
        <div class="mt-8">
            <div>System Prompt:</div>
            <textarea class="p-4" readonly disabled cols="80" rows="20">{{ chatStore.payload.system }}</textarea>
        </div>
        <div class="flex justify-center my-6">Messages</div>
        <div class="flex justify-end">
            <textarea v-for="message in chatStore.payload.messages" class="p-4" readonly disabled cols="80" rows="20">{{ message }}</textarea>
        </div>

        <!--  -->


        <div v-if="false" class="mt-6 flex flex-col gap-2">
            <div class="mr-10">
                Use cached response
                <input v-model="useCache" type="checkbox" checked="checked" class="toggle toggle-sm"/>
            </div>
            <div class="flex gap-4">
                <button @click="saveResponse" class="btn btn-primary btn-outline btn-sm">
                    Cache current response
                </button>
                <button class="btn btn-primary btn-sm" @click="demo">
                    Ask AI (demo)
                </button>
            </div>
        </div>


        <div class="mt-2 flex justify-end">
            <button class="btn btn-primary btn-sm" @click="sendPayload">
                Send message
            </button>
        </div>
        <MarkdownRenderer class="mt-10" :source="streamedResponse"/>
    </div>
</template>

<script>
import MarkdownRenderer from "./MarkdownRenderer.vue"
import Anthropic from "@anthropic-ai/sdk"
import {useChatStore} from "../stores/useChatStore.js"
import usePromptEditorsStore, {storeAccessor} from '../stores/promptEditorsStore.js'
import {ref, onUnmounted} from "vue"

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
        streamedResponse: '',
    }),
    setup() {
        const chatStore = useChatStore()

        const systemPromptEditorHTML = ref(storeAccessor.state.systemPrompt)
        const newMessageEditorHTML = ref(storeAccessor.state.newMessage)

        // Create subscription to sync state changes
        const unsubscribe = usePromptEditorsStore.subscribe((state) => {
            systemPromptEditorHTML.value = state.systemPrompt
            newMessageEditorHTML.value = state.newMessage
        })

        // Clean up subscription
        onUnmounted(() => {
            unsubscribe()
        })

        return {
            chatStore,
            systemPromptEditorHTML,
            newMessageEditorHTML,
        }
    },
    mounted() {
        // this.streamedResponse = localStorage.getItem('streamedResponse') || ''
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
                                "text": "Make a list of the .NET blazor stack components. Show some code examples."
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
        async preparePrompts() {

            const systemPromptHTML = storeAccessor.state.systemPrompt

            const newMessageHTML = storeAccessor.state.newMessage

            Promise.all([

                this.wire.call('renderPrompt', systemPromptHTML),

                this.wire.call('renderPrompt', newMessageHTML),

            ]).then(([systemPromptAsText, newMessageAsText]) => {

                this.chatStore.payload.system = systemPromptAsText

                this.chatStore.payload.messages.push(newMessageAsText)

            })
        },
        sendPayload() {
            alert('Not implemented')
        },
    },
}
</script>
