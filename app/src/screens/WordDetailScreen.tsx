import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

import { RootStackParamList } from '../navigation/types';
import { DictionaryEntry, Meaning } from '../types/dictionary';
import { colors } from '../constants/colors';
import { useFavorites } from '../hooks/useFavorites';
import { fetchWord } from '../services/dictionaryApi';

type Route = RouteProp<RootStackParamList, 'WordDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function MeaningSection({
  meaning,
  onSynonymPress,
  loadingSynonym,
}: {
  meaning: Meaning;
  onSynonymPress: (word: string) => void;
  loadingSynonym: string | null;
}) {
  return (
    <View style={styles.meaningBlock}>
      <View style={styles.partOfSpeechRow}>
        <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
        <View style={styles.divider} />
      </View>

      {meaning.definitions.map((def, i) => (
        <View key={i} style={styles.definitionItem}>
          <Text style={styles.defNumber}>{i + 1}.</Text>
          <View style={styles.defContent}>
            <Text style={styles.defText}>{def.definition}</Text>
            {def.example ? (
              <Text style={styles.defExample}>"{def.example}"</Text>
            ) : null}
          </View>
        </View>
      ))}

      {meaning.synonyms.length > 0 && (
        <View style={styles.tagsRow}>
          <Text style={styles.tagsLabel}>Synonyms: </Text>
          {meaning.synonyms.slice(0, 5).map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tag, loadingSynonym === s && styles.tagLoading]}
              onPress={() => onSynonymPress(s)}
              disabled={!!loadingSynonym}
            >
              <Text style={styles.tagText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function WordDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { entries, breadcrumbs = [] } = route.params;
  const entry: DictionaryEntry = entries[0];
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [playing, setPlaying] = useState(false);
  const [loadingSynonym, setLoadingSynonym] = useState<string | null>(null);

  const phoneticObj = entry.phonetics.find(p => p.text && p.audio) ?? entry.phonetics.find(p => p.text);
  const phonetic = entry.phonetic ?? phoneticObj?.text;
  const audioUrl = entry.phonetics.find(p => p.audio)?.audio;

  const favorited = isFavorite(entry.word);
  const shortDefinition = entry.meanings[0]?.definitions[0]?.definition ?? '';

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(entry.word);
    } else {
      addFavorite({ word: entry.word, phonetic, shortDefinition, savedAt: Date.now() });
    }
  };

  const playAudio = async () => {
    if (!audioUrl || playing) return;
    try {
      setPlaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setPlaying(false);
          sound.unloadAsync();
        }
      });
      await sound.playAsync();
    } catch {
      setPlaying(false);
    }
  };

  const handleSynonymPress = async (word: string) => {
    if (loadingSynonym) return;
    setLoadingSynonym(word);
    try {
      const synEntries = await fetchWord(word);
      navigation.push('WordDetail', {
        entries: synEntries,
        breadcrumbs: [...breadcrumbs, entry.word],
      });
    } catch {
      alert(`"${word}" was not found in the dictionary`);
    } finally {
      setLoadingSynonym(null);
    }
  };

  const breadcrumbTitle = [...breadcrumbs, entry.word].join(' / ');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: breadcrumbs.length > 0 ? breadcrumbTitle : entry.word,
      headerTitleStyle: { fontSize: 14, color: colors.primary },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: undefined,
    });
  }, [breadcrumbs, entry.word]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.wordRow}>
            <View style={styles.wordMeta}>
              <Text style={styles.word}>{entry.word}</Text>
              {phonetic && (
                <View style={styles.phoneticRow}>
                  <Text style={styles.phonetic}>{phonetic}</Text>
                  {audioUrl && (
                    <TouchableOpacity onPress={playAudio} hitSlop={10} disabled={playing}>
                      <Ionicons
                        name={playing ? 'volume-high' : 'volume-medium-outline'}
                        size={20}
                        color={playing ? colors.primary : colors.textPlaceholder}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity onPress={toggleFavorite} hitSlop={12}>
              <Ionicons
                name={favorited ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={favorited ? colors.primary : colors.textPlaceholder}
              />
            </TouchableOpacity>
          </View>
        </View>

        {entry.meanings.map((meaning, i) => (
          <MeaningSection
            key={i}
            meaning={meaning}
            onSynonymPress={handleSynonymPress}
            loadingSynonym={loadingSynonym}
          />
        ))}

        {entry.sourceUrls?.length > 0 && (
          <Text style={styles.source}>Source: {entry.sourceUrls[0]}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  backBtn: {
    marginLeft: 4,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 4 },
    }),
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  wordMeta: {
    flex: 1,
    gap: 6,
  },
  word: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phonetic: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '500',
  },
  meaningBlock: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  partOfSpeechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  partOfSpeech: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  definitionItem: {
    flexDirection: 'row',
    gap: 8,
  },
  defNumber: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginTop: 2,
    minWidth: 18,
  },
  defContent: {
    flex: 1,
    gap: 4,
  },
  defText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  defExample: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  tagsLabel: {
    fontSize: 13,
    color: colors.textPlaceholder,
    fontWeight: '600',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagLoading: {
    opacity: 0.4,
  },
  tagText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  source: {
    fontSize: 12,
    color: colors.borderLight,
    textAlign: 'center',
    marginTop: 8,
  },
});
