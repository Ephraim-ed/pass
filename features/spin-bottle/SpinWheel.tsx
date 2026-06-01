import * as Haptics from 'expo-haptics';
import React, { useImperativeHandle, forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  players: string[];
  targetIndex: number | null;
  isSpinning: boolean;
  onSpin: (onAngle: (angle: number, spins: number) => void) => void;
};

export type SpinWheelRef = {
  triggerSpin: () => void;
};

const PLAYER_COLORS = [
  COLORS.pink, COLORS.mint, COLORS.yellow, COLORS.purple, COLORS.tomato, COLORS.sky,
];

export default forwardRef<SpinWheelRef, Props>(function SpinWheel(
  { players, targetIndex, isSpinning, onSpin },
  ref,
) {
  const bottleRot = useSharedValue(0);

  function handleSpin() {
    onSpin((finalAngle) => {
      const fireHaptic = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bottleRot.value = withTiming(finalAngle, {
        duration: 3200,
        easing: Easing.out(Easing.cubic),
      }, () => {
        runOnJS(fireHaptic)();
      });
    });
  }

  useImperativeHandle(ref, () => ({ triggerSpin: handleSpin }));

  const bottleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bottleRot.value}deg` }],
  }));

  const ORBIT_RADIUS = 120;
  const CENTER = 160;
  const count = players.length;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: CENTER * 2, height: CENTER * 2 }}>
        {/* Player circles in orbit */}
        {players.map((name, i) => {
          const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
          const x = CENTER + ORBIT_RADIUS * Math.cos(angle) - 28;
          const y = CENTER + ORBIT_RADIUS * Math.sin(angle) - 28;
          const isSelected = targetIndex === i && !isSpinning;
          const chipColor = PLAYER_COLORS[i % PLAYER_COLORS.length];

          return (
            <View
              key={name}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: isSelected ? COLORS.pink : chipColor,
                borderWidth: 2.5,
                borderColor: COLORS.ink,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: isSelected ? 1.15 : 1 }],
              }}
            >
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 11, color: COLORS.ink, textAlign: 'center' }}>
                {name}
              </Text>
            </View>
          );
        })}

        {/* Bottle in center */}
        <View
          style={{
            position: 'absolute',
            left: CENTER - 40,
            top: CENTER - 40,
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Animated.View style={[{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }, bottleStyle]}>
            <Svg width="80" height="80" viewBox="0 0 80 80">
              <Circle cx="40" cy="40" r="16" fill={COLORS.mint} stroke={COLORS.ink} strokeWidth="2.5" />
              <Line x1="40" y1="40" x2="40" y2="10" stroke={COLORS.ink} strokeWidth="4" strokeLinecap="round" />
              <Path d="M36 10 Q40 4 44 10" fill={COLORS.mint} stroke={COLORS.ink} strokeWidth="2" />
            </Svg>
          </Animated.View>
        </View>
      </View>

      <Pressable
        onPress={handleSpin}
        disabled={isSpinning}
        style={{
          marginTop: 24,
          backgroundColor: isSpinning ? COLORS.ink2 : COLORS.ink,
          paddingHorizontal: 40,
          paddingVertical: 16,
          borderRadius: RADIUS.pill,
        }}
      >
        <Text style={{ fontFamily: FONTS.uiBold, fontSize: 18, color: COLORS.cream }}>
          {isSpinning ? 'Spinning...' : 'Spin!'}
        </Text>
      </Pressable>
    </View>
  );
});
