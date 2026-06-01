import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '@/theme/tokens';

const TABS = [
  { label: 'Play', path: '/(tabs)/home' },
  { label: 'Crew', path: '/(tabs)/crew' },
  { label: 'History', path: '/(tabs)/history' },
] as const;

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 12,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.ink,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 4,
      }}
    >
      {TABS.map((tab) => {
        const active = pathname === tab.path || pathname === tab.path.replace('/(tabs)', '');
        return (
          <Pressable
            key={tab.label}
            onPress={() => router.push(tab.path as any)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: active ? COLORS.cream : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.uiBold,
                fontSize: 14,
                color: active ? COLORS.ink : COLORS.ink2,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
