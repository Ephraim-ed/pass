import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '@/theme/tokens';

type Props = {
  color: string;
  radius?: number;
  shadowY?: number;
  rotate?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function Sticker({
  color,
  radius = RADIUS.lg,
  shadowY = 5,
  rotate = 0,
  style,
  children,
}: Props) {
  return (
    <View style={[{ transform: [{ rotate: `${rotate}deg` }] }, style]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { top: shadowY, borderRadius: radius, backgroundColor: COLORS.ink },
        ]}
      />
      <View
        style={{ borderRadius: radius, borderWidth: 2.5, borderColor: COLORS.ink, backgroundColor: color }}
      >
        {children}
      </View>
    </View>
  );
}
