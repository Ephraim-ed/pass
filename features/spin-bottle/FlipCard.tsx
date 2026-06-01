import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  prompt: string;
  type: 'truth' | 'dare';
};

export default function FlipCard({ prompt, type }: Props) {
  const flip = useSharedValue(0);
  const flipped = useSharedValue(false);

  useEffect(() => {
    flip.value = 0;
    flipped.value = false;
  }, [prompt]);

  function handleFlip() {
    if (!flipped.value) {
      flip.value = withTiming(1, { duration: 420 });
      flipped.value = true;
    }
  }

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const accentColor = type === 'truth' ? COLORS.purple : COLORS.tomato;

  return (
    <Pressable onPress={handleFlip} style={styles.container}>
      {/* Front face */}
      <Animated.View style={[styles.card, { backgroundColor: accentColor }, frontStyle]}>
        <Text style={styles.label}>{type === 'truth' ? 'TRUTH' : 'DARE'}</Text>
        <Text style={styles.hint}>Tap to reveal</Text>
      </Animated.View>

      {/* Back face */}
      <Animated.View style={[styles.card, styles.back, { backgroundColor: COLORS.cream }, backStyle]}>
        <Text style={styles.typeLabel}>{type.toUpperCase()}</Text>
        <Text style={styles.promptText}>{prompt}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 180,
    alignSelf: 'center',
  },
  card: {
    ...StyleSheet.absoluteFill,
    borderRadius: RADIUS.xl,
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  back: {
    backgroundColor: COLORS.cream,
  },
  label: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.cream,
  },
  hint: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.cream,
    opacity: 0.7,
    marginTop: 8,
    letterSpacing: 1.5,
  },
  typeLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.ink2,
    marginBottom: 12,
  },
  promptText: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.inkSoft,
    textAlign: 'center',
    lineHeight: 26,
  },
});
