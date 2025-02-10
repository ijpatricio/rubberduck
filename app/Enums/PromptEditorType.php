<?php

namespace App\Enums;

enum PromptEditorType: string
{
    case SYSTEM_PROMPT = 'system_prompt';
    case NEM_MESSAGE = 'new_message';
}
