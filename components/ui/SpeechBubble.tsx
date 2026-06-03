import React from 'react';
import { Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  text: string;
};

export default function SpeechBubble({ text }: Props) {
  const bg = COLORS.cream;

  return (
    <View style={{ alignSelf: 'flex-start', maxWidth: 220 }}>
      {/* Bubble body */}
      <View
        style={{
          backgroundColor: bg,
          borderRadius: RADIUS.lg,
          borderWidth: 2.5,
          borderColor: COLORS.ink,
          paddingHorizontal: 14,
          paddingVertical: 10,
          shadowColor: COLORS.ink,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.uiBold,
            fontSize: 13,
            color: COLORS.ink,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>

    </View>
  );
}
