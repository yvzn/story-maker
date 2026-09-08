export type WordCount = 50 | 150;

export function parseWordCount(w: string | null): WordCount | undefined {
	if (!w) return undefined;
	const wc = parseInt(w, 10);
	if (isNaN(wc)) return undefined;
	if (wc !== 50 && wc !== 150) return undefined;
	return wc as WordCount;
}
