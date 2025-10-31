export type Language = 'en' | 'fr';

export function parseLanguage(l: string | null): Language | undefined {
	if (!l) return undefined;
	const lang = l.toLowerCase() as Language;
	return lang === 'en' || lang === 'fr' ? lang : undefined;
}
