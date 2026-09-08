import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";

export async function readBlobContent(containerName: string, blobName: string): Promise<NodeJS.ReadableStream | undefined> {
	const blockBlobClient = await getBlobBlockClient(containerName, blobName);
	if (!(await blockBlobClient.exists())) {
		return undefined;
	}

	const downloadBlockBlobResponse = await blockBlobClient.download(0);
	return downloadBlockBlobResponse.readableStreamBody;
}

export async function writeBlobContent(containerName: string, blobName: string, content: string): Promise<void> {
	const blockBlobClient = await getBlobBlockClient(containerName, blobName);
	await blockBlobClient.upload(content, Buffer.byteLength(content));
}

export async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
	readable.setEncoding('utf8');
	let data = '';
	for await (const chunk of readable) {
		data += chunk;
	}
	return data;
}

async function getBlobBlockClient(containerName: string, blobName: string): Promise<BlockBlobClient> {
	const connectionString = process.env.PROMPTS_STORAGE_CONNECTION_STRING;
	if (!connectionString) {
		throw new Error("PROMPTS_STORAGE_CONNECTION_STRING is not defined");
	}

	const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	await containerClient.createIfNotExists();

	const blockBlobClient = containerClient.getBlockBlobClient(blobName);
	return blockBlobClient;
}
