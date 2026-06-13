import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  /** Background colour of the revealed (back) face. */
  backColor: string;
  /** Fires the first time the card is fully revealed. */
  onReveal?: () => void;
  /** Revealed content. */
  children: React.ReactNode;
};

/**
 * Press-and-HOLD to flip the card open; release to flip it shut.
 * Built for pass-the-phone privacy — the secret is only visible while held.
 */
export default function HoldCard({ backColor, onReveal, children }: Props) {
  const flip = useSharedValue(0);
  const hasRevealed = useSharedValue(false);

  // Reset whenever the revealed content changes (new player / new round)
  useEffect(() => {
    flip.value = 0;
    hasRevealed.value = false;
  }, [children]);

  function fireReveal() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onReveal?.();
  }

  function open() {
    flip.value = withTiming(1, { duration: 280 });
    if (!hasRevealed.value) {
      hasRevealed.value = true;
      runOnJS(fireReveal)();
    }
  }

  function close() {
    flip.value = withTiming(0, { duration: 220 });
  }

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
    opacity: flip.value < 0.5 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    opacity: flip.value < 0.5 ? 0 : 1,
  }));

  return (
    <Pressable
      onPressIn={open}
      onPressOut={close}
      style={styles.container}
    >
      {/* Front — face down */}
      <Animated.View style={[styles.card, { backgroundColor: COLORS.ink }, frontStyle]}>
        <Text style={styles.lock}>🤫</Text>
        <Text style={styles.frontLabel}>HOLD TO REVEAL</Text>
        <Text style={styles.frontHint}>Keep it hidden from everyone else</Text>
      </Animated.View>

      {/* Back — the secret */}
      <Animated.View style={[styles.card, { backgroundColor: backColor }, backStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
    alignSelf: 'center',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  lock: {
    fontSize: 40,
    marginBottom: 12,
  },
  frontLabel: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.cream,
    letterSpacing: 0.5,
  },
  frontHint: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.ink2,
    letterSpacing: 1,
    marginTop: 10,
    textAlign: 'center',
  },
});
