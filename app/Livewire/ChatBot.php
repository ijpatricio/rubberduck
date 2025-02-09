<?php

namespace App\Livewire;

use Livewire\Component;
use Anthropic\Anthropic;
use Illuminate\Support\Facades\Http;

class ChatBot extends Component
{
    public $prompt = 'hello, take your time';
    public $question = '';
    public $answer = '';

    function submitPrompt()
    {
        $this->question = $this->prompt;
        $this->prompt = '';
        $this->js('$wire.ask()');
    }

    function ask()
    {
        try {
            // Reset answer at the start
            $this->answer = '';

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

            while (!$body->eof()) {
                $chunk = $body->read(1024);
                $buffer .= $chunk;

                // Process complete events
                while (($newlinePosition = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $newlinePosition);
                    $buffer = substr($buffer, $newlinePosition + 1);

                    if (str_starts_with($line, 'data: ')) {
                        $jsonData = substr($line, 6); // Remove 'data: ' prefix

                        if ($jsonData === '[DONE]') {
                            continue;
                        }

                        $data = json_decode($jsonData, true);

                        if (isset($data['type']) && $data['type'] === 'content_block_delta') {
                            $newText = $data['delta']['text'] ?? '';

                            // Update both the stream and the answer property
                            $this->answer .= $newText;
                            $this->stream(
                                to: 'answer',
                                content: $this->answer
                            );
                        }
                    }
                }
            }

        } catch (\Exception $e) {
            $this->answer = "Error: " . $e->getMessage();
            $this->stream(
                to: 'answer',
                content: $this->answer
            );
        }
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            <section>
                <div>ChatBot</div>

                @if ($question)
                    <article>
                        <hgroup>
                            <h3>User</h3>
                            <p>{{ $question }}</p>
                        </hgroup>

                        <hgroup>
                            <h3>ChatBot</h3>
                            <p wire:stream="answer">{{ $answer }}</p>
                        </hgroup>
                    </article>
                @endif
            </section>

            <form wire:submit="submitPrompt">
                <input wire:model="prompt" type="text" placeholder="Send a message" autofocus>
                <button type="submit">Send</button>
            </form>
        </div>
        HTML;
    }
}
