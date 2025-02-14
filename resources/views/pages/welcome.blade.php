@use(\App\Enums\PromptEditorType)

<div class="m-10">
    <div>
        <h1 class="flex justify-center text-3xl font-bold">RubberDuck AI</h1>
    </div>

    <div class="mt-6 flex flex-col justify-center items-center gap-3">
        <div>
            <span class="text-lg font-bold">Project</span>
            {{ env('PROJECT_BASE_PATH', 'Project not defined in .env file') }}
        </div>

    </div>

    <div class="mt-10">
        <h1 class="text-xl font-bold">System Prompt</h1>

        <div class="mt-2 flex gap-4">
            <p class="text-gray-500">
                It's a set of foundational instructions that shape how the AI will interpret and respond to all interactions.
            </p>

            <x-modal-info-markdown title="More Info" content-view="what-is-system-prompt"/>
        </div>

        <div class="mt-4">
            <livewire:prompt-editor prompt-type="{{ PromptEditorType::SYSTEM_PROMPT->value }}"/>
        </div>
    </div>

    <livewire:talk />

    <livewire:prompt-editor prompt-type="{{ PromptEditorType::NEM_MESSAGE->value }}"/>

</div>
