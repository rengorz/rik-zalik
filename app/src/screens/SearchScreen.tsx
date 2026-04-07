import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDictionary } from '../hooks/useDictionary';
import { useFavorites } from '../hooks/useFavorites';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../constants/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { entries, loading, error, search, clear } = useDictionary();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigation = useNavigation<Nav>();

  const handleSearch = () => {
    if (query.trim()) search(query);
  };

  const handleClear = () => {
    setQuery('');
    clear();
  };

  const idle = !loading && !error && entries.length === 0;
  const hasResult = entries.length > 0;
  const firstEntry = entries[0];
  const firstDefinition = firstEntry?.meanings[0]?.definitions[0]?.definition ?? '';
  const phonetic = firstEntry?.phonetic ?? firstEntry?.phonetics.find(p => p.text)?.text;
  const favorited = firstEntry ? isFavorite(firstEntry.word) : false;

  const toggleFavorite = () => {
    if (!firstEntry) return;
    if (favorited) {
      removeFavorite(firstEntry.word);
    } else {
      addFavorite({ word: firstEntry.word, phonetic, shortDefinition: firstDefinition, savedAt: Date.now() });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>WordLookup</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Ionicons name="search" size={18} color={colors.textPlaceholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search a word..."
              placeholderTextColor={colors.textPlaceholder}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <Ionicons name="close-circle" size={18} color={colors.textPlaceholder} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchBtn, !query.trim() && styles.searchBtnDisabled]}
            onPress={handleSearch}
            disabled={!query.trim()}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Ionicons name="search-outline" size={48} color={colors.borderLight} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {idle && (
          <View style={styles.center}>
            <Ionicons name="book-outline" size={56} color={colors.borderLight} />
            <Text style={styles.idleText}>Type a word to look it up</Text>
          </View>
        )}

        {hasResult && !loading && (
          <TouchableOpacity
            style={styles.resultCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('WordDetail', { entries })}
          >
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <Text style={styles.resultWord}>{firstEntry.word}</Text>
                {phonetic && <Text style={styles.resultPhonetic}>{phonetic}</Text>}
              </View>
              <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons
                  name={favorited ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={favorited ? colors.primary : colors.textPlaceholder}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultPartOfSpeech}>
              {firstEntry.meanings[0]?.partOfSpeech}
            </Text>
            <Text style={styles.resultDefinition} numberOfLines={3}>
              {firstDefinition}
            </Text>
            <View style={styles.resultFooter}>
              <Text style={styles.resultMore}>See full definition</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  inputIcon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.textPrimary,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as object) : {}),
  },
  searchBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  searchBtnDisabled: {
    backgroundColor: colors.primaryMuted,
  },
  searchBtnText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 15,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  idleText: {
    fontSize: 16,
    color: colors.textPlaceholder,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    gap: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    flex: 1,
  },
  resultWord: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultPhonetic: {
    fontSize: 15,
    color: colors.primary,
  },
  resultPartOfSpeech: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textPlaceholder,
    marginBottom: 4,
  },
  resultDefinition: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  resultMore: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
