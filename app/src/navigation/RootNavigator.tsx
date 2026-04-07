import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import WordDetailScreen from '../screens/WordDetailScreen';
import { RootStackParamList, BottomTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const name = route.name === 'Search' ? 'search' : 'bookmark';
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Пошук' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Обране' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="WordDetail" component={WordDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
