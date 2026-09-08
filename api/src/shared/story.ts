import { ChapterId, OptionId as ChapterTemplateOptionId } from "./chapter.js";

export class Story {
	private constructor(public chapters: Map<ChapterId, GeneratedChapter>) { }

	get lastChapter(): GeneratedChapter | undefined {
		return this.chapters.get(this.lastChapterId);
	}

	private get lastChapterId(): ChapterId {
		return Math.max(...Array.from(this.chapters.keys())) as ChapterId;
	}

	append(chapterId: ChapterId, chapter: GeneratedChapter): Story {
		const newChapters = new Map(this.chapters);
		newChapters.set(chapterId, chapter);
		return new Story(newChapters);
	}

	static parse(s: string): Story {
		const raw = JSON.parse(s);
		const chapters = new Map<ChapterId, GeneratedChapter>();

		for (const [key, value] of Object.entries(raw)) {
			chapters.set(parseInt(key, 10) as ChapterId, value as GeneratedChapter);
		}

		return new Story(chapters);
	}

	static stringify(story: Story): string {
		const raw: Record<string, GeneratedChapter> = {};
		for (const [key, value] of story.chapters.entries()) {
			raw[key.toString()] = value;
		}
		return JSON.stringify(raw);
	}
}

export interface GeneratedChapter {
	prompt: string;
	content: string | undefined;
}

// ----------------------------------------------------------------------------

export class StoryTemplate {
	private constructor(
		private featureOptionsByChapter: Map<ChapterId, ChapterTemplateOptionId>
	) { }

	static parse(s: string | null): StoryTemplate | undefined {
		if (!s) return undefined;

		const featureOptionList = s.split('-').map(f => f.trim()).filter(f => f.length > 0);
		if (featureOptionList.length === 0) return undefined;

		const featureOptionsByChapter = featureOptionList.reduce((acc, option, index) => {
			const optionId = parseInt(option, 10) as ChapterTemplateOptionId;
			if (isNaN(optionId)) return acc;

			const chapterId = (index + 1) as ChapterId;
			acc.set(chapterId, optionId);

			return acc;
		}, new Map<ChapterId, ChapterTemplateOptionId>());

		return new StoryTemplate(featureOptionsByChapter);
	}

	unparse(): string {
		return Array.from(this.featureOptionsByChapter.values()).join('-');
	}

	get size(): number {
		return this.featureOptionsByChapter.size;
	}

	removeLastChapter(): StoryTemplate {
		const newFeatureOptions = new Map(this.featureOptionsByChapter);
		newFeatureOptions.delete(this.lastChapterId);
		return new StoryTemplate(newFeatureOptions);
	}

	get lastChapterId(): ChapterId {
		return Math.max(...Array.from(this.featureOptionsByChapter.keys())) as ChapterId;
	}

	getLastChapterOptionId(): ChapterTemplateOptionId | undefined {
		return this.featureOptionsByChapter.get(this.lastChapterId);
	}
}


