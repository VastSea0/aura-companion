import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; // <-- Import this
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// RootNavigation.js
// RootNavigation.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
let isNavigationReady = false;

export function setNavigationReady(ready) {
  isNavigationReady = ready;
}

export function navigate(name, params) {
  if (navigationRef.isReady() && isNavigationReady) {
    navigationRef.navigate(name, params);
  } else {
    console.log('Waiting for navigation to be ready...');
    // Retry after a short delay
    setTimeout(() => {
      if (navigationRef.isReady() && isNavigationReady) {
        navigationRef.navigate(name, params);
      } else {
        console.log('Navigation still not ready, failed to navigate to:', name);
      }
    }, 500);
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setNavigationReady(true);
        console.log('Navigation is ready');
      }}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </NavigationContainer>
  );
}