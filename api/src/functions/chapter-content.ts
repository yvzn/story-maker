import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { Language, parseLanguage } from "../shared/language";
import { readChapterTemplate } from "../shared/chapter";
import { readBlobContent, streamToText, writeBlobContent } from "../shared/storage";
import { parseWordCount, WordCount } from "../shared/word-count";
import { GeneratedChapter, Story, StoryTemplate } from "../shared/story";
import { AssistantResponse, Prompt, PromptMessage, readSystemPrompt, SystemPrompt, UserPrompt } from "../shared/prompt";
import { getModelResponse } from "../shared/language-model";

export async function getChapterContent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const l = request.query.get('l');
	const language = parseLanguage(l);

	const w = request.query.get('w');
	const wordCount = parseWordCount(w);

	const s = request.query.get('s');
	const storyTemplate = StoryTemplate.parse(s);

	if (!language || !wordCount || !storyTemplate) {
		return { status: 400, body: "Bad Request" };
	}

	const chapter = await generateLastChapter(language, wordCount, storyTemplate);
	if (!chapter) {
		return { status: 400, body: "Bad Request" };
	}

	return {
		body: chapter,
		headers: { 'Content-Type': 'text/plain;charset=utf-8' }
	};
};

app.http('chapter-content', {
	methods: ['GET'],
	authLevel: 'function',
	handler: getChapterContent
});

// ------------------------------------------------------------------

async function generateLastChapter(
	language: Language,
	wordCount: WordCount,
	storyTemplate: StoryTemplate): Promise<string | undefined> {

	const story = await generateStory(language, wordCount, storyTemplate);
	return story?.lastChapter?.content;
}

async function generateStory(
	language: Language,
	wordCount: WordCount,
	storyTemplate: StoryTemplate): Promise<Story | undefined> {

	const cacheKey = getCacheKey(language, wordCount, storyTemplate);
	const cachedResponse = await readCachedStory(cacheKey);

	if (cachedResponse) {
		return cachedResponse;
	}

	if (storyTemplate.size === 0) {
		throw new Error("Story template has no chapters");
	}

	const systemPrompt = await readSystemPrompt(language);
	if (!systemPrompt) {
		return undefined;
	}

	const systemPromptMessage: SystemPrompt = {
		role: 'system',
		content: formatSystemPrompt(systemPrompt, language, wordCount)
	}

	// recursion: terminal case
	if (storyTemplate.size === 1) {
		const lastChapterId = storyTemplate.lastChapterId;
		const lastChapterOptionId = storyTemplate.getLastChapterOptionId();

		const chapterTemplate = await readChapterTemplate(language, lastChapterId);
		if (!chapterTemplate) {
			return undefined;
		}

		const featureOption = chapterTemplate.features.options.find(option => option.id === lastChapterOptionId);
		if (!featureOption) {
			return undefined;
		}

		const chapterPrompt = `The ${chapterTemplate.details?.name} is ${featureOption.name}. Description: ${featureOption.description.join(' ')}. It highlights the following values: ${featureOption.valuesHighlighted}. Please continue the story with ${chapterTemplate.details?.feature}.`;
		const chapterPromptMessage: UserPrompt = {
			role: 'user',
			content: chapterPrompt
		};

		const promptMessages = new Prompt(systemPromptMessage, chapterPromptMessage);

		const modelResponse = await getModelResponse(promptMessages);

		const generatedChapter: GeneratedChapter = {
			prompt: chapterPrompt,
			content: modelResponse
		};
		const storyWithNewChapter = Story.parse('{}').append(lastChapterId, generatedChapter);

		await writeStoryToCache(cacheKey, storyWithNewChapter);

		return storyWithNewChapter;
	}

	// recursion: general case
	const previousChaptersTemplate = storyTemplate.removeLastChapter();
	const previousChaptersStory = await generateStory(language, wordCount, previousChaptersTemplate);
	if (!previousChaptersStory) {
		return undefined;
	}

	const lastChapterId = storyTemplate.lastChapterId;
	const lastChapterOptionId = storyTemplate.getLastChapterOptionId();

	const chapterTemplate = await readChapterTemplate(language, lastChapterId);
	if (!chapterTemplate) {
		return undefined;
	}

	const featureOption = chapterTemplate.features.options.find(option => option.id === lastChapterOptionId);
	if (!featureOption) {
		return undefined;
	}

	const chapterPrompt = `The ${chapterTemplate.details?.name} is ${featureOption.name}. Description: ${featureOption.description.join(' ')}. It highlights the following values: ${featureOption.valuesHighlighted}. Please continue the story with ${chapterTemplate.details?.feature}.`;
	const chapterPromptMessage: UserPrompt = {
		role: 'user',
		content: chapterPrompt
	};

	const promptMessages = new Prompt(systemPromptMessage)
		.append(...mapToPrompt(previousChaptersStory))
		.append(chapterPromptMessage);

	const modelResponse = await getModelResponse(promptMessages);

	const generatedChapter: GeneratedChapter = {
		prompt: chapterPrompt,
		content: modelResponse
	};
	const storyWithNewChapter = previousChaptersStory.append(lastChapterId, generatedChapter);

	await writeStoryToCache(cacheKey, storyWithNewChapter);

	return storyWithNewChapter;
}

function formatSystemPrompt(systemPrompt: string, language: Language, wordCount: WordCount): string {
	let s = systemPrompt;
	s = s.replaceAll('{{language}}', language.label)
	s = s.replaceAll('{{word_count_per_chapter}}', '' + wordCount);
	return s;
}

function mapToPrompt(story: Story): Array<PromptMessage> {
	return Array.from(story.chapters.values())
		.map(chapter => [
			{
				role: 'user',
				content: chapter.prompt
			} as UserPrompt,
			{
				role: 'assistant',
				content: chapter.content
			} as AssistantResponse
		])
		.flat();
}

// ------------------------------------------------------------------

type CacheKey = string;

function getCacheKey(
	language: Language,
	wordCount: WordCount,
	storyTemplate: StoryTemplate): CacheKey {
	const partitionKey = `${language.code}-${wordCount}`;
	const rowKey = `${partitionKey}|${storyTemplate.unparse()}`;

	return rowKey;
}

async function readCachedStory(cacheKey: CacheKey): Promise<Story | undefined> {
	const containerName = 'chapters';
	const blobName = `${cacheKey}.json`;

	const blobContentStream = await readBlobContent(containerName, blobName);
	if (!blobContentStream) {
		return undefined;
	}

	const blobContent = await streamToText(blobContentStream);
	return Story.parse(blobContent);
}

async function writeStoryToCache(cacheKey: CacheKey, story: Story): Promise<void> {
	const containerName = 'chapters';
	const blobName = `${cacheKey}.json`;

	const blobContent = Story.stringify(story);
	await writeBlobContent(containerName, blobName, blobContent);
}
