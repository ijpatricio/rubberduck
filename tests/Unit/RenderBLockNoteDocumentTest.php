<?php

use App\RubberDuck;

test('Render BLock Note Document', function () {

    $document = File::json('tests/fixtures/block-note-document.json');

    $basePath =  env('PROJECT_BASE_PATH');

    app()->bind(RubberDuck::PROJECT_PATH, fn() => $basePath);

    $action = new \App\Actions\RenderPrompt();

    $result = $action($document);

    dd($result);
});
