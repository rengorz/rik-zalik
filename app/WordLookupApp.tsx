import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';

export default function WordLookupApp() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}
