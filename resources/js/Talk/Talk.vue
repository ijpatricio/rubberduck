<template>
    <div>
        <div class="mt-4 flex justify-end">
            <div class="flex gap-2">
                <div>System prompt ready: </div>
                <span v-if="chatStore.payload.system.length > 0"> ✅ </span>
                <span v-else> ❌ </span>
            </div>
        </div>

        <h1 class="text-xl font-bold">Messages</h1>

        <div class="mt-4 p-4 border rounded-lg bg-gray-800 border-gray-600 min-h-50 flex flex-col gap-4">
            <div v-for="message in chatStore.payload.messages">
                <div class="w-full flex " :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                    <div v-for="content in message.content">
                        <MarkdownRenderer
                            class="max-w-4xl"
                            :role="message.role"
                            :source="message.role === 'user' ? content.text.substring(0, 240) + '...' : content.text"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-2 mb-8 flex justify-end">
            <button class="btn btn-xs btn-link" @click="savePayload"> Save Payload to localstorage</button>
            <button class="btn btn-xs btn-link" @click="loadPayload"> Load Payload </button>
        </div>

        <h1 class="mt-8 mb-4 text-xl font-bold">New message</h1>

        <!-- Debug purposes -->
        <div v-if="1">
            <pre v-text="chatStore.payload"></pre>

            <!-- Prompt text previews -->
            <div class="mt-8">
                <div>System Prompt:</div>
                <textarea class="p-4" readonly disabled cols="80" rows="20">{{ chatStore.payload.system }}</textarea>
            </div>
            <div class="flex justify-end">
                <textarea v-for="message in chatStore.payload.messages" class="p-4" readonly disabled cols="80"
                          rows="20">{{ message }}</textarea>
            </div>
        </div>
    </div>
</template>

<script>
import MarkdownRenderer from "./MarkdownRenderer.vue"
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

        window.Livewire.on('setSystemPrompt', this.setSystemPrompt)
        window.Livewire.on('sendMessage', this.sendMessage)
    },
    methods: {

        prepareClient() {
            this.chatStore.prepareClient({
                apiKey: this.mingleData['api_key'],
                model: this.mingleData.model,
                max_tokens: 4096,
                temperature: 0
            })
        },

        async sendMessage() {
            if (this.chatStore.payload.system.length === 0) {
                alert('System prompt is empty. Aborting.')
                return
            }

            // Render user message
            const newMessageAsText = await this.wire.call('renderPrompt', storeAccessor.state.newMessage)

            this.chatStore.addUserMessage(newMessageAsText)

            window.Livewire.dispatch('clearNewMessage')

            await this.chatStore.sendMessage()
        },

        setSystemPrompt() {
            this.wire
                .call('renderPrompt', storeAccessor.state.systemPrompt)
                .then((systemPromptAsText) => {
                    this.chatStore.payload.system = systemPromptAsText
                })
                .catch((error) => alert(error))
        },

        savePayload() {
            localStorage.setItem('full_payload', JSON.stringify(this.chatStore.payload))
        },

        loadPayload() {
            this.chatStore.payload = JSON.parse(localStorage.getItem('full_payload'))
        },
    },
}
</script>
