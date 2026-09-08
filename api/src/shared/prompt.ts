import { Language } from "./language";
import { readBlobContent, streamToText } from "./storage";

export class Prompt {
	public messages: Array<PromptMessage> = []

	constructor(...promptMessages: Array<PromptMessage>) {
		this.messages = promptMessages;
	}

	append(...promptMessages: Array<PromptMessage>): Prompt {
		return new Prompt(...this.messages, ...promptMessages);
	}
}

export type PromptMessage = SystemPrompt | UserPrompt | AssistantResponse;

export interface SystemPrompt {
	role: 'system';
	content: string;
}

export interface UserPrompt {
	role: 'user';
	content: string;
}

export interface AssistantResponse {
	role: 'assistant';
	content: string;
}

// ----------------------------------------------------------------------------

export async function readSystemPrompt(language: Language): Promise<string | undefined> {
	const containerName = 'prompts';
	const blobName = `s.${language.code}.md`;

	const blobContentStream = await readBlobContent(containerName, blobName);
	if (!blobContentStream) {
		return undefined;
	}

	const blobContent = await streamToText(blobContentStream);
	return blobContent;
}
