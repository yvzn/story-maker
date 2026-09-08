import { Prompt } from "./prompt";
import { Mistral } from '@mistralai/mistralai';

const mistralApiKey = process.env.MISTRAL_API_KEY;
const mistralModelName = 'ministral-3b-latest';

const mistralClient = new Mistral({ apiKey: mistralApiKey });

export async function getModelResponse(prompt: Prompt): Promise<string> {
	const chatResponse = await mistralClient.chat.complete({
		model: mistralModelName,
		messages: [...prompt.messages]
	});

	return sanitize(chatResponse.choices[0].message?.content);
}

function sanitize(value: unknown): string {
	if (typeof value === 'string') return value;
	return '';
}
