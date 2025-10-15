import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { parse } from 'yaml';

export async function features(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const l = request.query.get('l');
	const language = parseLanguage(l);

	const c = request.query.get('c');
	const chapter = parseChapter(c);

	if (!language || !chapter) {
		return { status: 400, body: "Bad Request" };
	}

	const featureSet = await readFeatureSet(language, chapter);
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
	authLevel: 'anonymous',
	handler: features,
});

// ------------------------------------------------------------------

type Language = 'en' | 'fr';

function parseLanguage(l: string | null): Language | undefined {
	if (!l) return undefined;
	const lang = l.toLowerCase() as Language;
	return lang === 'en' || lang === 'fr' ? lang : undefined;
}

function parseChapter(c: string | null): number | undefined {
	if (!c) return undefined;
	const chapter = parseInt(c, 10);
	if (isNaN(chapter)) return undefined;
	if (chapter < 1 || chapter > 6) return undefined;
	return chapter;
}

interface FeatureSet {
	options: FeatureSetOption[];
}

export interface FeatureSetOption {
	id: number;
	name: string;
	description: string;
	values_highlighted: string;
	visual_prompts: string;
}

async function readFeatureSet(language: Language, chapter: number): Promise<FeatureSet | undefined> {
	const connectionString = process.env.PROMPTS_STORAGE_CONNECTION_STRING;
	if (!connectionString) {
		throw new Error("PROMPTS_STORAGE_CONNECTION_STRING is not defined");
	}

	const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

	const containerName = 'prompts';
	const containerClient = blobServiceClient.getContainerClient(containerName);

	const blobName = `c${chapter}.${language}.yaml`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	if (!(await blockBlobClient.exists())) {
		return undefined;
	}

	const downloadBlockBlobResponse = await blockBlobClient.download(0);
	if (!downloadBlockBlobResponse.readableStreamBody) {
		return undefined;
	}

	const blobContent = await streamToText(downloadBlockBlobResponse.readableStreamBody!);
	const featureSet = parse(blobContent) as FeatureSet;

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
