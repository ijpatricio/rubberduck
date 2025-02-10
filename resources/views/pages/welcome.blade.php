<div class="m-10">

    <div>
        <h1 class="text-3xl font-bold">System Prompt</h1>

        <div class="flex gap-4">
            <p class="text-gray-500">Think of it as the foundational instructions that shape how the AI will interpret and respond to all interactions.</p>

            <x-modal-info-markdown title="More Info" content-view="what-is-system-prompt"/>
        </div>
    </div>

    <div class="h-4"></div>

    <livewire:prompt-editor prompt-type="systemPrompt" />

    <div class="mt-16">
        <h1 class="text-3xl font-bold">Chat</h1>

        <div class="flex gap-4">
            <p class="text-gray-500">Think of it as the foundational instructions that shape how the AI will interpret and respond to all interactions.</p>

            <x-modal-info-markdown title="More Info" content-view="what-is-system-prompt"/>
        </div>
    </div>

    <div class="h-4"></div>

    <livewire:prompt-editor prompt-type="newMessage" />

    <livewire:talk />

</div>
