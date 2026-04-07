import { DictionaryEntry } from '../types/dictionary';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchWord(word: string): Promise<DictionaryEntry[]> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(word.trim())}`);

  if (response.status === 404) {
    throw new Error('Word not found');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch word');
  }

  return response.json();
}
