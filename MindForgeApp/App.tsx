import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { UserProvider, useUser } from './src/contexts/UserContext';
import { VocabularyProvider } from './src/contexts/VocabularyContext';
import AppNavigator from './src/navigation/AppNavigator';
import Onboarding from './src/components/onboarding/Onboarding';

function AppContent() {
  const { colors, theme, loaded: themeLoaded } = useTheme();
  const { isOnboarded, loaded: userLoaded } = useUser();

  if (!themeLoaded || !userLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <NavigationContainer>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <VocabularyProvider>
              <AppContent />
            </VocabularyProvider>
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
