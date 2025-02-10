<?php

test('Render BLock Note Document', function () {

    $document = File::json('tests/fixtures/block-note-document.json');

    $action = new \App\Actions\RenderPrompt();

    $result = $action($document);

    dd($result);
});
