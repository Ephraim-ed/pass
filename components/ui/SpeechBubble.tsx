import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  text: string;
};

export default function SpeechBubble({ text }: Props) {
  return (
    <View>
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: RADIUS.md,
          borderWidth: 2.5,
          borderColor: COLORS.ink,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontFamily: FONTS.ui, fontSize: 15, color: COLORS.inkSoft }}>{text}</Text>
      </View>
      {/* Triangle tail */}
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  tail: {
    position: 'absolute',
    bottom: -12,
    left: 24,
    width: 16,
    height: 12,
    backgroundColor: COLORS.card,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: COLORS.ink,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
});
