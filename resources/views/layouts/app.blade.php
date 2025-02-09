<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @hasSection('title')
        <title>@yield('title') - {{ config('app.name') }}</title>
    @else
        <title>{{ config('app.name') }}</title>
    @endif

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ url(asset('images/favicon.png')) }}">

    <!-- Fonts -->
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @stack('head_start')

    @filamentStyles

    @mingles
    @vite(['resources/css/app.css'])

    @livewireStyles
    @livewireScripts

    @stack('head_end')
</head>

<body class="min-h-screen grid grid-rows-[auto_1fr] min-w-[375px]" x-init>

@yield('content')

@filamentScripts
@stack('body_end')
</body>
</html>
