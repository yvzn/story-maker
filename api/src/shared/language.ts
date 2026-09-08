const languages = {
    en: { code: 'en', label: 'English' },
    fr: { code: 'fr', label: 'Français' }
} as const;

export type Language = typeof languages[keyof typeof languages];

export function parseLanguage(l: string | null): Language | undefined {
    if (!l) return undefined;

    const normalized = l.toLowerCase();
    return Object.values(languages).find(language => language.code === normalized);
}
