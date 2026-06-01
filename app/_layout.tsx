import {
  BricolageGrotesque_800ExtraBold,
  useFonts as useBricolage,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Geist_600SemiBold,
  Geist_700Bold,
  useFonts as useGeist,
} from '@expo-google-fonts/geist';
import {
  GeistMono_500Medium,
  useFonts as useGeistMono,
} from '@expo-google-fonts/geist-mono';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [bricoLoaded] = useBricolage({ BricolageGrotesque_800ExtraBold });
  const [geistLoaded] = useGeist({ Geist_600SemiBold, Geist_700Bold });
  const [monoLoaded] = useGeistMono({ GeistMono_500Medium });

  const loaded = bricoLoaded && geistLoaded && monoLoaded;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
