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
        <div class="mt-2 flex justify-end">
            <button class="btn btn-primary btn-sm" @click="sendPayload">
                Send message
            </button>
        </div>

        <!-- Reply -->
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
        streamedResponse: '',
        client: null,
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
        onUnmounted(() => unsubscribe())

        return {
            chatStore,
            systemPromptEditorHTML,
            newMessageEditorHTML,
        }
    },
    mounted() {
        this.prepareClient()
    },
    methods: {
        prepareClient() {
            this.client = new Anthropic({
                apiKey: this.mingleData['api_key'],
                dangerouslyAllowBrowser: true,
            })
            this.chatStore.payload.model = this.mingleData.model
            this.chatStore.payload.max_tokens = 4096
            this.chatStore.payload.temperature = 0
        },
        async sendPayload() {

            this.streamedResponse = ''


            // Create a streaming message
            const stream = await this.client.messages.create({...this.chatStore.payload})

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

                // For now, just ready to send first message. There's a lot o business logic to be added here
                this.chatStore.payload.messages = []

                this.chatStore.payload.messages.push({
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: newMessageAsText,
                        }
                    ]
                })

            })
        },
    },
}
</script>
