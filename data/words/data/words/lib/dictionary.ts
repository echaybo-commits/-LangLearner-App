import { WordEntry } from '@/types';

const coreDicts: Record<string, WordEntry[]> = {};

export async function loadCoreDictionary(lang: string): Promise<WordEntry[]> {
  if (coreDicts[lang]) return coreDicts[lang];
  try {
    const res = await fetch(`/data/words/${lang}.json`);
    const data = await res.json();
    coreDicts[lang] = data;
    return data;
  } catch (e) {
    console.error('Failed to load core dictionary for', lang);
    return [];
  }
}

export function searchInCore(lang: string, word: string): WordEntry | undefined {
  const dict = coreDicts[lang] || [];
  return dict.find(entry => entry.word.toLowerCase() === word.toLowerCase());
}

export async function fetchFromWiktionary(word: string, sourceLang: string, targetLang: string): Promise<WordEntry | null> {
  try {
    const url = `https://${sourceLang}.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return null;
  } catch {
    return null;
  }
}

export async function lookupWord(word: string, sourceLang: string, targetLang: string): Promise<WordEntry | null> {
  const core = searchInCore(sourceLang, word);
  if (core) return core;

  const stored = localStorage.getItem(`extended_${sourceLang}_${word}`);
  if (stored) {
    try {
      return JSON.parse(stored) as WordEntry;
    } catch { }
  }

  const fromWiki = await fetchFromWiktionary(word, sourceLang, targetLang);
  if (fromWiki) {
    localStorage.setItem(`extended_${sourceLang}_${word}`, JSON.stringify(fromWiki));
    return fromWiki;
  }
  return null;
}

export function getGlobalDict() {
  return coreDicts;
}
