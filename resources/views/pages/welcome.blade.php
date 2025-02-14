@use(\App\Enums\PromptEditorType)

<div class="m-10">
    <div>
        <h1 class="text-3xl font-bold">Project</h1>

        <div>
            {{ env('PROJECT_BASE_PATH', 'Project not defined in .env file') }}
        </div>
    </div>

    <div class="mt-12">
        <h1 class="text-xl font-bold">System Prompt</h1>

        <div class="mt-2 flex gap-4">
            <p class="text-gray-500">
                Think of it as the foundational instructions that shape how the AI will interpret
                and respond to all interactions.
            </p>

            <x-modal-info-markdown title="More Info" content-view="what-is-system-prompt"/>

        </div>

    </div>

    <div class="h-4"></div>

    <div class="max-w-4xl">
        <livewire:prompt-editor prompt-type="{{ PromptEditorType::SYSTEM_PROMPT->value }}"/>
    </div>


    <div class="mt-16">
        <h1 class="text-xl font-bold">Send a message</h1>

        <div class="mt-2 flex gap-4">
            <p class="text-gray-500"></p>
        </div>

    </div>

    <div class="h-4"></div>

    <livewire:prompt-editor prompt-type="{{ PromptEditorType::NEM_MESSAGE->value }}"/>

    <livewire:talk />

</div>
