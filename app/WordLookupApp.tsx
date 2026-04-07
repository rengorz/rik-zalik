import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';
import { FavoritesProvider } from './src/context/FavoritesContext';

export default function WordLookupApp() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </FavoritesProvider>
  );
}
