<?php

use App\RubberDuck;

test('Render BLock Note Document', function () {

    $blockNoteHTML = <<<'HTML'
    <div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="6053fab9-7b22-4247-b112-a2d81715e438"><div class="bn-block" data-node-type="blockContainer" data-id="6053fab9-7b22-4247-b112-a2d81715e438"><div class="bn-block-content" data-content-type="heading"><h1 class="bn-inline-content">O pente do careca</h1></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="e39a9318-dc8b-4e67-af94-263d2e8e89d7"><div class="bn-block" data-node-type="blockContainer" data-id="e39a9318-dc8b-4e67-af94-263d2e8e89d7"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">apples</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="5a63b19d-cce7-445e-8b46-0dc2fb72a0e1"><div class="bn-block" data-node-type="blockContainer" data-id="5a63b19d-cce7-445e-8b46-0dc2fb72a0e1"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">oranges</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="2f153c31-934d-4961-93d0-9f865fc62c30"><div class="bn-block" data-node-type="blockContainer" data-id="2f153c31-934d-4961-93d0-9f865fc62c30"><div class="bn-block-content" data-content-type="bulletListItem"><p class="bn-inline-content">bananas</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="29b33558-7478-4253-a11e-6b148727381b"><div class="bn-block" data-node-type="blockContainer" data-id="29b33558-7478-4253-a11e-6b148727381b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Hey hello</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="c19e742e-196a-49dc-bfde-4e06d6716dd5"><div class="bn-block" data-node-type="blockContainer" data-id="c19e742e-196a-49dc-bfde-4e06d6716dd5"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-blue-800" data-inline-content-type="mention" data-title="first-one.txt" data-type="rule" data-value="first-one.txt">#rule:first-one.txt</span></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="3f36360e-1294-4778-8bf1-0dad996ac647"><div class="bn-block" data-node-type="blockContainer" data-id="3f36360e-1294-4778-8bf1-0dad996ac647"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">File:</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="28e837a8-ab8b-42b6-821d-edda52a10c80"><div class="bn-block" data-node-type="blockContainer" data-id="28e837a8-ab8b-42b6-821d-edda52a10c80"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-green-800" data-inline-content-type="mention" data-title="README.md" data-type="file" data-value="README.md">@file:README.md</span></p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="88bb4409-0089-45f9-ba5e-3d3c5e4b3d91"><div class="bn-block" data-node-type="blockContainer" data-id="88bb4409-0089-45f9-ba5e-3d3c5e4b3d91"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Bla bla</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="6bc70a77-cd78-4463-bec4-091f545b2a2b"><div class="bn-block" data-node-type="blockContainer" data-id="6bc70a77-cd78-4463-bec4-091f545b2a2b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"><span class="py-0.5 px-2 rounded text-white bg-green-800" data-inline-content-type="mention" data-title="app/Casts/MoneyCast.php" data-type="file" data-value="app/Casts/MoneyCast.php">@file:app/Casts/MoneyCast.php</span> </p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="d79d8b86-22d7-48ed-abc0-23326d0355ea"><div class="bn-block" data-node-type="blockContainer" data-id="d79d8b86-22d7-48ed-abc0-23326d0355ea"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content"></p></div></div></div></div>
    HTML;

    $basePath = env('PROJECT_BASE_PATH');

    app()->bind(RubberDuck::PROJECT_PATH, fn() => $basePath);

    $action = new \App\Actions\RenderPrompt;

    $result = $action($blockNoteHTML);

    dd($result);
});
