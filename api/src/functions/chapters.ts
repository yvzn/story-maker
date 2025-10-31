import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { parseLanguage } from "../shared/language";
import { ChapterId } from "../shared/chapter";
import { FeatureSetOptionId } from "../shared/feature";

export async function chapters(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const l = request.query.get('l');
	const language = parseLanguage(l);

	const w = request.query.get('w');
	const wordCount = parseWordCount(w);

	const s = request.query.get('s');
	const storyFeatures = parseStoryFeatures(s);

	if (!language || !wordCount) {
		return { status: 400, body: "Bad Request" };
	}

	return { body: undefined };
};

app.http('chapters', {
	methods: ['GET'],
	authLevel: 'function',
	handler: chapters
});

// ------------------------------------------------------------------

type WordCount = 50 | 150;

function parseWordCount(w: string | null): WordCount | undefined {
	if (!w) return undefined;
	const wc = parseInt(w, 10);
	if (isNaN(wc)) return undefined;
	if (wc !== 50 && wc !== 150) return undefined;
	return wc as WordCount;
}

type StoryFeatures = Map<ChapterId, FeatureSetOptionId>;

function parseStoryFeatures(s: string | null): StoryFeatures {
	const emptyFeatureMap = new Map<ChapterId, FeatureSetOptionId>();
	if (!s) return emptyFeatureMap

	const features = s.split('-').map(f => f.trim()).filter(f => f.length > 0);
	if (features.length === 0) return emptyFeatureMap;

	const featureMap = features.reduce((acc, feature, index) => {
		const featureId = parseInt(feature, 10) as FeatureSetOptionId;
		if (isNaN(featureId)) return acc;

		const chapterId = (index + 1) as ChapterId;
		acc.set(chapterId, featureId);

		return acc;
	}, emptyFeatureMap);

	if (!isValidStoryFeatureSequence(featureMap)) {
		return emptyFeatureMap
	}

	return featureMap;
}

function isValidStoryFeatureSequence(featureMap: StoryFeatures): boolean {
	const keys = Array.from(featureMap.keys());

	// empty map is valid
	if (keys.length === 0) return true;

	// must start with chapter 1
	if (keys[0] !== 1) return false;

	// must be consecutive chapters
	for (let i = 1; i < keys.length; i++) {
		if (keys[i] - keys[i - 1] !== 1) return false;
	}

	return true;
}

