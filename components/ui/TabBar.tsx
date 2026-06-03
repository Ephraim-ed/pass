import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '@/theme/tokens';

function PlayIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path d="M4 2 L13 8 L4 14 Z" fill={color} />
    </Svg>
  );
}

function CrewIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={14} viewBox="0 0 16 14" fill="none">
      <Circle cx={5} cy={4} r={2.5} stroke={color} strokeWidth={1.8} />
      <Circle cx={11} cy={4} r={2.5} stroke={color} strokeWidth={1.8} />
      <Path d="M1 13 Q5 8 9 13" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <Path d="M7 13 Q11 8 15 13" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function HistoryIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={8} r={6.5} stroke={color} strokeWidth={1.8} />
      <Path d="M8 4 V8 L11 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

const TABS = [
  { label: 'Play', path: '/(tabs)/home', Icon: PlayIcon },
  { label: 'Crew', path: '/(tabs)/crew', Icon: CrewIcon },
  { label: 'History', path: '/(tabs)/history', Icon: HistoryIcon },
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
        paddingVertical: 8,
        gap: 4,
      }}
    >
      {TABS.map((tab) => {
        const active =
          pathname === tab.path ||
          pathname === tab.path.replace('/(tabs)', '');
        const iconColor = active ? COLORS.ink : COLORS.cream;
        return (
          <Pressable
            key={tab.label}
            onPress={() => router.push(tab.path as any)}
            style={{
              paddingHorizontal: active ? 18 : 14,
              paddingVertical: 9,
              borderRadius: 999,
              backgroundColor: active ? COLORS.cream : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <tab.Icon color={iconColor} />
            {active && (
              <Text
                style={{
                  fontFamily: FONTS.uiBold,
                  fontSize: 13,
                  color: COLORS.ink,
                }}
              >
                {tab.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
