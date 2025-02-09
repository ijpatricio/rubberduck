<?php

arch('Debug statements')
    ->expect(['dd', 'dump', 'ray'])
    ->not->toBeUsed();
