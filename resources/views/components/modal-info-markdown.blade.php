@props([
    'title' => '',
    'contentView'
    ])

@php
    use Illuminate\Support\Str;
    use Illuminate\Support\Facades\File;

    $modalId = 'modal_'. Str::random(8);

    if (filled($contentView)) {
        $viewContents = str(view('content.'.$contentView))
            ->markdown([
                'html_input' => 'strip',
                'allow_unsafe_links' => false
            ]);
    }
@endphp

    <!-- Open the modal using ID.showModal() method -->
<button class="btn btn-ghost btn-xs" onclick="{{ $modalId }}.showModal()">{{ $title }}</button>

<dialog id="{{ $modalId }}" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">{{ $title ?? '' }}</h3>

        @isset($viewContents)
            <div class="py-4 typography">
                {!! $viewContents !!}
            </div>
        @endif

        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>
