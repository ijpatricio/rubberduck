Based on the search results, I can provide a comprehensive explanation of what a system prompt is in AI endpoints:

# System Prompt in AI Endpoints

A system prompt is a special type of instruction or message that sets the foundation for how an AI model should behave in subsequent interactions. It's typically included at the beginning of an API call and serves several key purposes:

## Key Characteristics

1. **Behavior Definition**
- Sets the AI's role, personality, and operating parameters
- Defines the scope and limitations of what the AI can do
- Establishes the context for the entire conversation

2. **Persistent Instructions**
- Remains active throughout the conversation
- Influences how the AI interprets and responds to all user messages

## Common Uses

1. **Role Setting**
- Defining the AI's expertise (e.g., "You are a helpful programming assistant")
- Setting the tone and style of responses
- Establishing behavioral boundaries

2. **Framework Definition**
- Specifying available tools and APIs
- Setting output formats
- Defining response constraints

3. **Safety and Compliance**
- Implementing content filtering
- Establishing ethical guidelines
- Setting operational boundaries

## Technical Implementation

- Included in the API request as a separate message type (usually with "role": "system")
- Typically placed at the beginning of the conversation
- Different from user messages and assistant responses
- Can be modified between conversations to alter the AI's behavior

## Best Practices

1. **Clarity**: Write clear, specific instructions
2. **Consistency**: Maintain consistent instructions throughout the session
3. **Specificity**: Include relevant constraints and capabilities
4. **Scope**: Define the boundaries of what the AI should and shouldn't do

The system prompt is essentially the "configuration layer" that shapes how the AI model will interpret and respond to all subsequent interactions within that session.
