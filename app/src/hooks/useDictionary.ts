import { useState, useCallback } from 'react';
import { DictionaryEntry } from '../types/dictionary';
import { fetchWord } from '../services/dictionaryApi';

interface State {
  entries: DictionaryEntry[];
  loading: boolean;
  error: string | null;
}

export function useDictionary() {
  const [state, setState] = useState<State>({
    entries: [],
    loading: false,
    error: null,
  });

  const search = useCallback(async (word: string) => {
    if (!word.trim()) return;

    setState({ entries: [], loading: true, error: null });

    try {
      const entries = await fetchWord(word);
      setState({ entries, loading: false, error: null });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      setState({ entries: [], loading: false, error: message });
    }
  }, []);

  const clear = useCallback(() => {
    setState({ entries: [], loading: false, error: null });
  }, []);

  return { ...state, search, clear };
}
