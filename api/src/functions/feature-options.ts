import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { parseLanguage } from "../shared/language.js";
import { ChapterTemplate, parseChapterId, readChapterTemplate } from "../shared/chapter.js";

export async function getFeatureOptions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const l = request.query.get('l');
	const language = parseLanguage(l);

	const c = request.query.get('c');
	const chapterId = parseChapterId(c);

	if (!language || !chapterId) {
		return { status: 400, body: "Bad Request" };
	}

	const chapterTemplate = await readChapterTemplate(language, chapterId);
	const featureOptions = mapFeatureOptions(chapterTemplate);

	if (!featureOptions) {
		return { status: 404, body: "Not Found" };
	}

	return {
		body: JSON.stringify(featureOptions),
		headers: { 'Content-Type': 'application/json' },
	};
};

app.http('feature-options', {
	methods: ['GET'],
	authLevel: 'function',
	handler: getFeatureOptions,
});

// ------------------------------------------------------------------

function mapFeatureOptions(chapterTemplate: ChapterTemplate | undefined) {
	if (!chapterTemplate) {
		return undefined;
	}

	return {
		options: chapterTemplate.features.options.map(option => ({
			id: option.id,
			name: option.name,
			description: option.description,
		})),
	}
}
