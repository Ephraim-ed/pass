import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { loadItem } from '@/utils/storage';
import { COLORS } from '@/theme/tokens';

export default function Index() {
  const [dest, setDest] = useState<'onboarding' | 'home' | null>(null);

  useEffect(() => {
    loadItem<{ hasOnboarded?: boolean }>('pass_state', {}).then((s) => {
      setDest(s.hasOnboarded ? 'home' : 'onboarding');
    });
  }, []);

  if (!dest) return <View style={{ flex: 1, backgroundColor: COLORS.cream }} />;
  if (dest === 'onboarding') return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)/home" />;
}
