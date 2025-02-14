<template>
    <div>

        <div class="flex justify-center my-6">Messages</div>

        <div class="mt-2 flex justify-end">
            <button class="btn btn-primary btn-sm" @click="sendMessage">
                Send message
            </button>
        </div>

        <div v-for="message in chatStore.payload.messages" class="mt-2 flex justify-end">
            <div
                v-for="content in message.content"
                class="max-w-3xl flex"
            >
                <MarkdownRenderer class="mt-10" :source="content.text"/>
            </div>
        </div>

        <button class="btn btn-xs btn-link" @click="savePayload"> Save Payload to localstorage</button>
        <button class="btn btn-xs btn-link" @click="loadPayload"> Load Payload </button>
        <pre v-text="chatStore.payload"></pre>


        <!-- Prompt text previews -->
        <div class="mt-8">
            <div>System Prompt:</div>
            <textarea class="p-4" readonly disabled cols="80" rows="20">{{ chatStore.payload.system }}</textarea>
        </div>
        <div class="flex justify-end">
            <textarea v-for="message in chatStore.payload.messages" class="p-4" readonly disabled cols="80" rows="20">{{ message }}</textarea>
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
            if (this.chatStore.payload.system === '') {
                alert('System prompt is empty')
            }

            // Render user message
            const newMessageAsText = await this.wire.call('renderPrompt', storeAccessor.state.newMessage)

            this.chatStore.addUserMessage(newMessageAsText)

            await this.chatStore.sendMessage()
        },

        setSystemPrompt() {
            alert('yes')
            this.wire
                .call('renderPrompt', storeAccessor.state.systemPrompt)
                .then((systemPromptAsText) => this.chatStore.payload.system = systemPromptAsText)
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
