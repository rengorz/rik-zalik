import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteWord } from '../types/dictionary';

const STORAGE_KEY = 'favorites';

interface FavoritesContextValue {
  favorites: FavoriteWord[];
  addFavorite: (item: FavoriteWord) => void;
  removeFavorite: (word: string) => void;
  isFavorite: (word: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
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
      setFavorites(prev => {
        if (prev.some(f => f.word === item.word)) return prev;
        const updated = [item, ...prev];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const removeFavorite = useCallback((word: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.word !== word);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (word: string) => favorites.some(f => f.word === word),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
}
