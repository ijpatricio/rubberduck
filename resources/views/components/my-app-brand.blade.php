<a href="/" wire:navigate>
    <!-- Hidden when collapsed -->
    <div {{ $attributes->class(["hidden-when-collapsed"]) }}>
        <div class="flex items-center gap-2">
            <x-icon name="o-square-3-stack-3d" class="w-6 -mb-1 text-indigo-400" />
            <span class="font-bold text-2xl me-3 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent ">
                {{ isset($title) ? $title.' - '.config('app.name') : config('app.name') }}
            </span>
        </div>
    </div>

    <!-- Display when collapsed -->
    <div class="display-when-collapsed hidden mx-5 mt-4 lg:mb-6 h-[28px]">
        <x-icon name="s-square-3-stack-3d" class="w-6 -mb-1 text-purple-500" />
    </div>
</a>
