import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Search: { active: 'search', inactive: 'search-outline' },
  Favorites: { active: 'bookmark', inactive: 'bookmark-outline' },
};

const TAB_LABELS: Record<string, string> = {
  Search: 'Search',
  Favorites: 'Saved',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={route.key} style={styles.tabWrapper}>
            {index > 0 && <View style={styles.divider} />}
            <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.7}>
              <Ionicons
                name={(isFocused ? icon.active : icon.inactive) as any}
                size={22}
                color={isFocused ? colors.primary : colors.textPlaceholder}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {TAB_LABELS[route.name]}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    gap: 3,
    ...Platform.select({
      ios: { paddingBottom: 24 },
      android: { paddingBottom: 8 },
      default: { paddingBottom: 8 },
    }),
  },
  label: {
    fontSize: 11,
    color: colors.textPlaceholder,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
  },
});
