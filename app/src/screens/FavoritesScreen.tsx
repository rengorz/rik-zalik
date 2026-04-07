import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFavorites } from '../hooks/useFavorites';
import { fetchWord } from '../services/dictionaryApi';
import { RootStackParamList } from '../navigation/types';
import { FavoriteWord } from '../types/dictionary';
import { colors } from '../constants/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="bookmark-outline" size={56} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No saved words yet</Text>
      <Text style={styles.emptySubtitle}>
        Search for a word and tap the bookmark icon to save it here
      </Text>
    </View>
  );
}

function FavoriteCard({
  item,
  onPress,
  onRemove,
}: {
  item: FavoriteWord;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardMain}>
          <Text style={styles.cardWord}>{item.word}</Text>
          {item.phonetic && <Text style={styles.cardPhonetic}>{item.phonetic}</Text>}
          <Text style={styles.cardDefinition} numberOfLines={2}>
            {item.shortDefinition}
          </Text>
        </View>
        <TouchableOpacity onPress={onRemove} hitSlop={12} style={styles.removeBtn}>
          <Ionicons name="bookmark" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, removeFavorite } = useFavorites();

  const handlePress = async (word: string) => {
    try {
      const entries = await fetchWord(word);
      navigation.navigate('WordDetail', { entries });
    } catch {
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.word}
        contentContainerStyle={[
          styles.list,
          favorites.length === 0 && styles.listEmpty,
        ]}
        ListHeaderComponent={<Text style={styles.title}>Saved Words</Text>}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <FavoriteCard
            item={item}
            onPress={() => handlePress(item.word)}
            onRemove={() => removeFavorite(item.word)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  listEmpty: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardMain: {
    flex: 1,
    gap: 3,
  },
  cardWord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardPhonetic: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  cardDefinition: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginTop: 2,
  },
  removeBtn: {
    paddingTop: 2,
  },
});
