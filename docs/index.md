1st usable feature:

- We can ask about any project on the disk
  - We have to define the project base_path
  - Basepath: ~/sites/Geridoc/**
  - Exclusions: hardcoded, in the finder
- I'm able to do a prompt and get a response. 
- No multiple projects at this point.
- No multiple chats at this point.
- It has a system prompt.
- The prompt have tags.
  - Tags are like `@rule:foo.txt`
  - Tags are like `@file:resources/views/xpto.blade.php`
  - We can eval/render prompts with tags, thus getting the final/result prompt.
- We can add Tags.
  - Rule tags
    - We add Rules manually, in text files, to `storage/app/rules/foo.txt`
    - Rules repository can list them, by Key.
    - In the UI, we get a Rule tag by searching. We add a Tag: "rule:{filename}"
  - File tags
    - Files repository can list them, by "filepath" (relative to the base path)
    - In the UI, we get a File tag by searching. We add a Tag: "file:{filename}"
- We can now have this exact RAW text stored (memory store for now - and persist in Local storage).
    ```
    --- system
    @rule:xpto.text
    --- user
    In these files:
    @file:resources/views/xpto.blade.php
    @file:resources/views/foobar.blade.php
    
    help me to get livewireid
    ```
- We want to click "Send" and get a response.
  - We need to eval the TAGS, replacing them with their respective "render".
  - We need an Action to Evaluate the Prompt
- We now have the Final prompt ready.
- Create Payload, persist in Store, ask confirm?
- We send to ClaudeAPI, get a response, persist (increment/replace), and show it.
- We also need a clear button.
  
