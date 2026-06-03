import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { COLORS, FONTS } from '@/theme/tokens';

type Props = {
  players: string[];
  targetIndex: number | null;
  isSpinning: boolean;
  onSpin: (velocity: number, onAngle: (finalAngle: number, duration: number) => void) => void;
};

const PLAYER_COLORS = [
  COLORS.pink, COLORS.mint, COLORS.yellow, COLORS.purple, COLORS.tomato, COLORS.sky,
];

const ORBIT_RADIUS = 120;
const CENTER = 160;

export default function SpinWheel({ players, targetIndex, isSpinning, onSpin }: Props) {
  const bottleRot = useSharedValue(0);
  const hintOpacity = useSharedValue(0);
  const hintX = useSharedValue(0);

  // Show pulsing swipe arrows only when waiting for a new spin
  useEffect(() => {
    const idle = !isSpinning && targetIndex === null;
    if (idle) {
      hintOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.35, { duration: 500 }),
        ),
        -1,
        true,
      );
      hintX.value = withRepeat(
        withSequence(
          withTiming(7, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      cancelAnimation(hintOpacity);
      cancelAnimation(hintX);
      hintOpacity.value = withTiming(0, { duration: 180 });
      hintX.value = 0;
    }
  }, [isSpinning, targetIndex]);

  const leftArrowStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
    transform: [{ translateX: -hintX.value }],
  }));

  const rightArrowStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
    transform: [{ translateX: hintX.value }],
  }));

  function handleSpin(velocity = 0) {
    onSpin(velocity, (finalAngle, duration) => {
      const fireHaptic = () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bottleRot.value = withTiming(
        finalAngle,
        { duration, easing: Easing.out(Easing.cubic) },
        () => runOnJS(fireHaptic)(),
      );
    });
  }

  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (isSpinning) return;
    const speed = Math.sqrt(e.velocityX * e.velocityX + e.velocityY * e.velocityY);
    if (speed > 80) runOnJS(handleSpin)(speed);
  });

  const bottleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bottleRot.value}deg` }],
  }));

  const count = players.length;

  return (
    <View style={{ alignItems: 'center' }}>
      <GestureDetector gesture={swipeGesture}>
        <View style={{ width: CENTER * 2, height: CENTER * 2 }}>

          {/* Dashed orbit ring */}
          <View
            style={{
              position: 'absolute',
              left: CENTER - ORBIT_RADIUS - 12,
              top: CENTER - ORBIT_RADIUS - 12,
              width: (ORBIT_RADIUS + 12) * 2,
              height: (ORBIT_RADIUS + 12) * 2,
              borderRadius: ORBIT_RADIUS + 12,
              borderWidth: 1.5,
              borderColor: COLORS.ink,
              borderStyle: 'dashed',
              opacity: 0.2,
            }}
          />

          {/* Player chips in orbit */}
          {players.map((name, i) => {
            const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
            const x = CENTER + ORBIT_RADIUS * Math.cos(angle) - 28;
            const y = CENTER + ORBIT_RADIUS * Math.sin(angle) - 28;
            const isSelected = targetIndex === i && !isSpinning;
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
                  backgroundColor: isSelected ? COLORS.pink : PLAYER_COLORS[i % PLAYER_COLORS.length],
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

          {/* Left swipe arrow */}
          <Animated.View
            style={[
              { position: 'absolute', left: CENTER - 72, top: CENTER - 12 },
              leftArrowStyle,
            ]}
          >
            <Svg width={20} height={24} viewBox="0 0 20 24" fill="none">
              <Path d="M13 4 L5 12 L13 20" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Animated.View>

          {/* Right swipe arrow */}
          <Animated.View
            style={[
              { position: 'absolute', left: CENTER + 52, top: CENTER - 12 },
              rightArrowStyle,
            ]}
          >
            <Svg width={20} height={24} viewBox="0 0 20 24" fill="none">
              <Path d="M7 4 L15 12 L7 20" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Animated.View>

          {/* Center disc */}
          <View
            style={{
              position: 'absolute',
              left: CENTER - 48,
              top: CENTER - 48,
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: COLORS.cream2,
              borderWidth: 2.5,
              borderColor: COLORS.ink,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: COLORS.ink,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            }}
          >
            <Animated.View style={[{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }, bottleStyle]}>
              <Svg width="80" height="80" viewBox="0 0 80 80">
                <Rect x="36" y="6" width="8" height="16" rx="2" fill={COLORS.ink} />
                <Path
                  d="M36 22 Q30 26 30 34 L30 64 Q30 71 37 71 L43 71 Q50 71 50 64 L50 34 Q50 26 44 22 Z"
                  fill="#D92020"
                  stroke={COLORS.ink}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <Rect x="31" y="39" width="18" height="17" rx="1.5" fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth="1.5" />
                <SvgText x="40" y="49" textAnchor="middle" fontFamily="serif" fontWeight="900" fontSize="6.5" fill="#1A6B1A">
                  UFC
                </SvgText>
                <Path d="M33 52 L47 52" stroke="#1A6B1A" strokeWidth="0.8" />
                <SvgText x="40" y="55" textAnchor="middle" fontFamily="serif" fontSize="3.5" fill="#1A6B1A">
                  KETCHUP
                </SvgText>
                <Path d="M32 29 Q31 42 32 62" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </Svg>
            </Animated.View>
          </View>

        </View>
      </GestureDetector>
    </View>
  );
}
