<template>
    <div>
        <textarea
            placeholder="System prompt"
            class="textarea textarea-bordered textarea-md w-full max-w-xs"
        ></textarea>
        <textarea
            placeholder="Ask a question"
            class="textarea textarea-bordered textarea-md w-full max-w-xs"
        ></textarea>

        <div>
            <button class="btn btn-primary btn-sm" @click="demo">
                Click me
            </button>
        </div>

        <!-- Add a container to show streaming response -->
        <div class="response-container">
            {{ streamedResponse }}
        </div>
    </div>
</template>

<script>
import Anthropic from "@anthropic-ai/sdk";

export default {
    props: {
        wire: Object,
        mingleData: Object,
    },
    data: () => ({
        counter: 0,
        streamedResponse: '', // Add this to store the streaming response
    }),
    methods: {
        ask() {
            this.wire.call('ask', this.mingleData)
        },
        async demo() {
            // Reset the streamed response
            this.streamedResponse = '';

            const anthropic = new Anthropic({
                apiKey: import.meta.env.VITE_ANTHROPIC_KEY,
                dangerouslyAllowBrowser: true,
            });

            // Create a streaming message
            const stream = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4096,
                temperature: 0,
                system: "Act as a successful developer that has over 20 years of experience, at designing web applications, using all CMS in the world, and a lot of publishing experience across many generalist and niche topics.",
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "if you have to start a cms builder framework from scratch,on top of an existing framework that deals with the architecture in terms of database, web requests, etc, what entities would you have to start with?"
                            }
                        ]
                    }
                ],
                stream: true // Enable streaming
            });

            // Process the stream
            try {
                for await (const messageChunk of stream) {
                    if (messageChunk.type === 'content_block_delta') {
                        this.streamedResponse += messageChunk.delta.text;
                    }
                }
            } catch (error) {
                console.error('Streaming error:', error);
            }
        },
    },
}
</script>

<style scoped>
.response-container {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 100px;
}
</style>
