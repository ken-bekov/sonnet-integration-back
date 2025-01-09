import Anthropic from "@anthropic-ai/sdk";

interface ApiServiceProps {
    apiKey: string;
    maxTokens: number;
}

export class AiService {
    maxTokens: number;
    apiKey: string;
    client: Anthropic;

    constructor(props: ApiServiceProps) {
        this.maxTokens = props.maxTokens;
        this.apiKey = props.apiKey;
        this.client = new Anthropic({apiKey: this.apiKey});
    }

    async sendMessage(text: string) {
        const result = await this.client.messages.create({
            model: 'claude-3-5-sonnet-latest',
            max_tokens: this.maxTokens,
            messages: [
                {
                    role: 'user',
                    content: [{
                        type: 'text',
                        text,
                    }]
                }
            ]
        });
        console.log(result);
        const {content} = result;
        if (content[0]?.type === 'text') {
            return content[0].text;
        } else {
            return '';
        }
    }
}