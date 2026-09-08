import { Language } from "./language";
import { readBlobContent, streamToText } from "./storage";

export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6;

export function parseChapterId(c: string | null): ChapterId | undefined {
	if (!c) return undefined;
	const chapter = parseInt(c, 10);
	if (isNaN(chapter)) return undefined;
	if (chapter < 1 || chapter > 6) return undefined;
	return chapter as ChapterId;
}

// ----------------------------------------------------------------------------

export interface ChapterTemplate {
	details: Details; // previously called "metadata"
	features: {
		options: Array<Option>; // previously at upper level, now nested under "features"
	}
}

interface Details {
	name: string;
	feature: string; // previously called "chapter"
	description: Array<string>;
}

class Option {
	id: OptionId = 0;
	name: string = '';
	description: Array<string> = [];
	valuesHighlighted: string = '';
	visualPrompts: string = '';
}

export type OptionId = number;

export async function readChapterTemplate(language: Language, chapterId: ChapterId): Promise<ChapterTemplate | undefined> {
	const containerName = 'prompts';
	const blobName = `c${chapterId}.${language.code}.json`;

	const blobContentStream = await readBlobContent(containerName, blobName);
	if (!blobContentStream) {
		return undefined;
	}

	const blobContent = await streamToText(blobContentStream);
	const chapterTemplate = JSON.parse(blobContent) as ChapterTemplate;

	return chapterTemplate;
}

// ----------------------------------------------------------------------------

