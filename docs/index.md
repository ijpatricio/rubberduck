1st usable feature:

- We can ask about any project on the disk
  - We have to define the project base_path, in the .env file
  - Exclusions: hardcoded, in the Finder class
- I'm able to do a prompt and get a response.
- No multiple projects at this point.
- No multiple chats at this point.
- It has a system prompt.
- The prompt have tags.
  - Rule tags are like `#foo.txt`
  - File tags are like `@resources/views/xpto.blade.php`
  - We can eval/render prompts with tags, thus getting the final/result prompt.
  - The render method has access to more schema, not only what we see in the tags.
- We can add Tags.
  - Rule tags
    - We add Rules manually, in text files, to `storage/app/rules/foo.txt`
    - Rules repository can list them, by Key.
    - In the UI, we get a Rule tag by typing '#'
  - File tags
    - Files repository can list them, by "filepath" (relative to the base path)
    - In the UI, we get a File tag by typing '@'
- We can now have these Prompts in the UI. We also get complete JSON (editor data).
    ```
    --- system
    @xpto.text
    --- user
    In these files:
    @resources/views/xpto.blade.php
    @resources/views/foobar.blade.php
    
    help me to get livewireid
    ```
========= ABOVE THIS IS DONE =========
- We want to click "Send" and get a response.
  - We need to eval the TAGS, replacing them with their respective "render".
  - We need an Action to get the Text/JSON, and evaluate the Prompts.
  - We now have the Final prompt ready.
  - Create Payload, persist in Store, ask confirm?
============> This is the current status:
======> TipTap PHP converter composer added. Pinia Store has the updated EditorDocuments.
======> We now need to click "Prepare prompts" and get the final prompt, to send as a 1st message.
  
- We send to ClaudeAPI, get a response, persist (increment/replace), and show it.
- We also need a clear button.
  
