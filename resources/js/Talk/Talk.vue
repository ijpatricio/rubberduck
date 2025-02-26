<template>
    <div>
        <div class="mt-4 flex justify-end">
            <div class="flex gap-2">
                <div>System prompt ready:</div>
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
            <button class="btn btn-xs btn-link" @click="loadPayload"> Load Payload</button>
            <button class="btn btn-xs btn-link" onclick="debug_values.showModal()">Debug raw values</button>
        </div>

        <!-- Debug purposes -->
        <dialog id="debug_values" class="modal">
            <div class="modal-box w-11/12 max-w-5xl">
                <h1 class="text-xl font-bold">Debug Raw values</h1>
                <p class="py-4">Press ESC key or click the button below to close</p>


                <h2 class="text-lg font-bold">System Prompt</h2>
                <div class="mt-4">
                    <textarea
                        class="p-4"
                        readonly
                        disabled
                        cols="80"
                        rows="20"
                        v-text="chatStore.payload.system"
                    ></textarea>
                </div>

                <h2 class="text-lg font-bold">Messages</h2>
                <div v-for="message in chatStore.payload.messages" >
                    <div :class="message.role === 'user' ? 'text-right' : 'text-left'">
                        <textarea
                            v-for="content in message.content"
                            class="p-4"
                            :class="message.role === 'user' ? 'bg-blue-800' : 'bg-gray-700'"
                            readonly
                            disabled
                            cols="80"
                            rows="20"
                            v-text="content.text"
                        ></textarea>
                    </div>
                </div>

                <h2 class="mt-16 text-lg font-bold">RAW Payload</h2>
                <textarea
                    class="p-4"
                    readonly
                    disabled
                    cols="80"
                    rows="20"
                    v-text="chatStore.payload"
                ></textarea>


                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>

        <h1 class="mt-8 mb-4 text-xl font-bold">New message</h1>
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
