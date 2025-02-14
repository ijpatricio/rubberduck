@foreach($files as $filepath)

<File Start: {{ $filepath }}>

{!! File::get($filepath) !!}

<End File Start: {{ $filepath }}>

@endforeach

