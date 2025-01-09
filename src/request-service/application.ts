import '@anthropic-ai/sdk/shims/node'
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({apiKey: ''});

const makeRequest = async () => {
    return client.messages.create({
        max_tokens: 1024,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'My name is Saken. Saken’s father name is Tolebek. Tolebek’s daughter name is Aigul',
                    },
                    {
                        type: 'text',
                        text: 'according to text provided above, tell me who is my sister',
                    }
                ]
            }
        ],
        model: 'claude-3-5-sonnet-latest',
    });
};

(async () => {
    const message = await makeRequest();
    console.log(message);
})()
