<?php

namespace App\Livewire;

use Livewire\Component;

class ChatBot extends Component
{
    public $prompt = 'hello, take your time';
    public $question = '';
    public $answer = '';
    public $streamedContent = '';

    function submitPrompt()
    {
        $this->question = $this->prompt;
        $this->prompt = '';
        $this->js('$wire.ask()');
    }

    function ask()
    {
        try {
            $this->reset('answer', 'streamedContent');

            $client = new \GuzzleHttp\Client();

            $response = $client->post('https://api.anthropic.com/v1/messages', [
                'headers' => [
                    'x-api-key' => config('services.anthropic.api_key'),
                    'anthropic-version' => '2023-06-01',
                    'content-type' => 'application/json',
                ],
                'json' => [
                    'model' => 'claude-3-sonnet-20240229',
                    'max_tokens' => 4096,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $this->question
                        ]
                    ],
                    'stream' => true
                ],
                'stream' => true
            ]);

            $buffer = '';
            $body = $response->getBody();
            $fullResponse = '';

            while (!$body->eof()) {
                $chunk = $body->read(1024);
                $buffer .= $chunk;

                while (($newlinePosition = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $newlinePosition);
                    $buffer = substr($buffer, $newlinePosition + 1);

                    if (str_starts_with($line, 'data: ')) {
                        $jsonData = substr($line, 6);

                        if ($jsonData === '[DONE]') {
                            continue;
                        }

                        $data = json_decode($jsonData, true);

                        if (isset($data['type']) && $data['type'] === 'content_block_delta') {
                            $newText = $data['delta']['text'] ?? '';
                            $fullResponse .= $newText;

                            $this->streamedContent .= $newText;

                            $this->stream(
                                to: 'streamedContent',
                                content: $this->streamedContent,
                                replace: true
                            );
                        }
                    }
                }
            }

            // Set the final complete response
            $this->answer = $fullResponse;
            $this->streamedContent = $fullResponse;

        } catch (\Exception $e) {
            $errorMessage = "Error: " . $e->getMessage();
            $this->answer = $errorMessage;
            $this->streamedContent = $errorMessage;
            $this->stream(
                to: 'streamedContent',
                content: $errorMessage
            );
        }
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <section>
                <div>ChatBot</div>

                <form wire:submit="submitPrompt">
                    <input wire:model="prompt" type="text" placeholder="Send a message" autofocus>
                    <button type="submit">Send</button>
                </form>

                @if ($question)
                    <article>
                        <hgroup>
                            <h3 class="font-bold"> > User</h3>
                            <p>{{ $question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3 class="font-bold"> > ChatBot</h3>
                            <div>
                                <p wire:stream="streamedContent">{{ $streamedContent }}</p>
                            </div>
                        </hgroup>
                    </article>
                @endif
            </section>

        </div>
        HTML;
    }
}
