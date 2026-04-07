import { DictionaryEntry } from '../types/dictionary';

export type RootStackParamList = {
  MainTabs: undefined;
  WordDetail: { entries: DictionaryEntry[]; breadcrumbs?: string[] };
};

export type BottomTabParamList = {
  Search: undefined;
  Favorites: undefined;
};
