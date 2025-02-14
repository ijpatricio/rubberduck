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
        <div>
            <button class="btn btn-primary btn-outline" onclick="system_prompt_modal.showModal()">System Prompt</button>
            <dialog id="system_prompt_modal" class="modal">
                <div class="modal-box w-11/12 max-w-5xl">

                    <!-- Close button top right -->
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h1 class="text-xl font-bold">System Prompt</h1>

                    <div class="mt-2 flex gap-4">
                        <p class="text-gray-500">
                            Think of it as the foundational instructions that shape how the AI will interpret
                            and respond to all interactions.
                        </p>

                        <x-modal-info-markdown title="More Info" content-view="what-is-system-prompt"/>
                    </div>

                    <div class="mt-10 mb-6">
                        <livewire:prompt-editor prompt-type="{{ PromptEditorType::SYSTEM_PROMPT->value }}"/>
                    </div>

                    <!-- Close by click Esc key and click-outside -->
                    <form method="dialog" class="modal-backdrop hidden">
                        <button>close</button>
                    </form>
                </div>
            </dialog>
        </div>
    </div>

    <livewire:talk />

    <hr class="my-4">

    <livewire:prompt-editor prompt-type="{{ PromptEditorType::NEM_MESSAGE->value }}"/>

</div>
