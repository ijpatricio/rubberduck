<?php

use App\RubberDuck;

test('Render BLock Note Document', function () {

    $blockNoteHTML = <<<'HTML'
    <div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="2674fb2d-30e3-4e88-afcb-ba0337e49dd4"><div class="bn-block" data-node-type="blockContainer" data-id="2674fb2d-30e3-4e88-afcb-ba0337e49dd4"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Hey hello</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="599c09c0-091c-4945-bf96-16ecb608063f"><div class="bn-block" data-node-type="blockContainer" data-id="599c09c0-091c-4945-bf96-16ecb608063f"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-blue-800" data-inline-content-type="mention" data-title="first-one.txt" data-type="rule" data-value="first-one.txt">#rule:first-one.txt</span></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="2d72b930-96f3-49c1-9748-5b8b455d30cf"><div class="bn-block" data-node-type="blockContainer" data-id="2d72b930-96f3-49c1-9748-5b8b455d30cf"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">File:</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="80850d1d-203e-4f81-9efc-86157450df3d"><div class="bn-block" data-node-type="blockContainer" data-id="80850d1d-203e-4f81-9efc-86157450df3d"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-green-800" data-inline-content-type="mention" data-title="README.md" data-type="file" data-value="README.md">@file:README.md</span></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="1d225898-bac0-4561-a441-eea0e5e4b954"><div class="bn-block" data-node-type="blockContainer" data-id="1d225898-bac0-4561-a441-eea0e5e4b954"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Bla bla</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="8d1451d7-42af-4de0-8ba3-0b2a0d952cf0"><div class="bn-block" data-node-type="blockContainer" data-id="8d1451d7-42af-4de0-8ba3-0b2a0d952cf0"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div></div>
    HTML;

    $basePath = env('PROJECT_BASE_PATH');

    app()->bind(RubberDuck::PROJECT_PATH, fn() => $basePath);

    $action = new \App\Actions\RenderPrompt;

    $result = $action($blockNoteHTML);

    dd($result);
});
