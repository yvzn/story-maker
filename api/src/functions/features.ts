import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";

import { Language, parseLanguage } from "../shared/language.js";
import { ChapterId } from "../shared/chapter.js";
import { FeatureSet } from "../shared/feature.js";

export async function features(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const l = request.query.get('l');
	const language = parseLanguage(l);

	const c = request.query.get('c');
	const chapterId = parseChapterId(c);

	if (!language || !chapterId) {
		return { status: 400, body: "Bad Request" };
	}

	const featureSet = await readFeatureSet(language, chapterId);
	if (!featureSet) {
		return { status: 404, body: "Not Found" };
	}

	return {
		body: JSON.stringify({ options: featureSet.options }),
		headers: { 'Content-Type': 'application/json' },
	};
};

app.http('features', {
	methods: ['GET'],
	authLevel: 'function',
	handler: features,
});

// ------------------------------------------------------------------

function parseChapterId(c: string | null): ChapterId | undefined {
	if (!c) return undefined;
	const chapter = parseInt(c, 10);
	if (isNaN(chapter)) return undefined;
	if (chapter < 1 || chapter > 6) return undefined;
	return chapter as ChapterId;
}

async function readFeatureSet(language: Language, chapterId: ChapterId): Promise<FeatureSet | undefined> {
	const connectionString = process.env.PROMPTS_STORAGE_CONNECTION_STRING;
	if (!connectionString) {
		throw new Error("PROMPTS_STORAGE_CONNECTION_STRING is not defined");
	}

	const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

	const containerName = 'prompts';
	const containerClient = blobServiceClient.getContainerClient(containerName);

	const blobName = `c${chapterId}.${language}.json`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	if (!(await blockBlobClient.exists())) {
		return undefined;
	}

	const downloadBlockBlobResponse = await blockBlobClient.download(0);
	if (!downloadBlockBlobResponse.readableStreamBody) {
		return undefined;
	}

	const blobContent = await streamToText(downloadBlockBlobResponse.readableStreamBody!);
	const featureSet = JSON.parse(blobContent) as FeatureSet;

	return featureSet;
}

async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
	readable.setEncoding('utf8');
	let data = '';
	for await (const chunk of readable) {
		data += chunk;
	}
	return data;
}
