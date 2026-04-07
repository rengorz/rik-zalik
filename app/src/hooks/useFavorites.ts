import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteWord } from '../types/dictionary';

const STORAGE_KEY = 'favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  const save = useCallback(async (updated: FavoriteWord[]) => {
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addFavorite = useCallback(
    (item: FavoriteWord) => {
      const already = favorites.some(f => f.word === item.word);
      if (!already) save([item, ...favorites]);
    },
    [favorites, save],
  );

  const removeFavorite = useCallback(
    (word: string) => {
      save(favorites.filter(f => f.word !== word));
    },
    [favorites, save],
  );

  const isFavorite = useCallback(
    (word: string) => favorites.some(f => f.word === word),
    [favorites],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
