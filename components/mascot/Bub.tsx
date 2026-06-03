import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { COLORS } from '@/theme/tokens';

export type BubPose = 'idle' | 'wave' | 'point' | 'mic' | 'cheer' | 'peek';

type Props = {
  pose?: BubPose;
  size?: number;
  color?: string;
  hat?: string;
};

export default function Bub({ pose = 'idle', size = 120, color = COLORS.yellow, hat = COLORS.pink }: Props) {
  const bodyRot = useSharedValue(0);
  const bodyY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const armRot = useSharedValue(0);
  const hatRot = useSharedValue(0);

  useEffect(() => {
    bodyRot.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    hatRot.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    if (pose === 'wave') {
      armRot.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 700 }),
          withTiming(28, { duration: 700 }),
        ),
        -1,
        true,
      );
    } else if (pose === 'point') {
      armRot.value = withRepeat(
        withSequence(withTiming(-2, { duration: 800 }), withTiming(2, { duration: 800 })),
        -1,
        true,
      );
    } else if (pose === 'cheer') {
      bodyScale.value = withRepeat(
        withSequence(withTiming(1.04, { duration: 500 }), withTiming(1, { duration: 500 })),
        -1,
        true,
      );
    }
  }, [pose]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${bodyRot.value}deg` },
      { translateY: bodyY.value },
      { scale: bodyScale.value },
    ],
  }));

  // Rotate around the right shoulder (SVG x=82, y=60 in 120×120 viewBox).
  // RN rotates around the view center (60,60), so we shift pivot via translate-rotate-translate.
  const armStyle = useAnimatedStyle(() => {
    const pivotX = (22 / 120) * size; // shoulder is 22 units right of center
    return {
      transform: [
        { translateX: pivotX },
        { rotate: `${armRot.value}deg` },
        { translateX: -pivotX },
      ],
    };
  });

  const hatStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${hatRot.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[{ width: size, height: size }, bodyStyle]}>
        <Svg viewBox="0 0 120 120" width="100%" height="100%">
          <Defs>
            <RadialGradient id={`grad_${pose}`} cx="40%" cy="30%">
              <Stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Ground shadow */}
          <Ellipse cx="60" cy="112" rx="28" ry="6" fill={COLORS.ink} opacity={0.15} />

          {/* Static arms for non-wave/point poses */}
          {(pose === 'idle' || pose === 'cheer' || pose === 'peek') && (
            <>
              <Path d="M38 65 Q20 60 18 50" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
              <Path d="M82 65 Q100 60 102 52" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
            </>
          )}
          {pose === 'mic' && (
            <>
              <Path d="M82 65 Q100 60 102 52" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
              <Rect x="98" y="44" width="8" height="14" rx="4" fill={COLORS.ink2} stroke={COLORS.ink} strokeWidth="1.5" />
            </>
          )}

          {/* Pear body */}
          <Path
            d="M60 22 C34 22 22 40 22 62 C22 84 38 104 60 104 C82 104 98 84 98 62 C98 40 86 22 60 22 Z"
            fill={color}
            stroke={COLORS.ink}
            strokeWidth="2.5"
          />
          <Path
            d="M60 22 C34 22 22 40 22 62 C22 84 38 104 60 104 C82 104 98 84 98 62 C98 40 86 22 60 22 Z"
            fill={`url(#grad_${pose})`}
          />

          {/* Blush */}
          <Ellipse cx="38" cy="72" rx="8" ry="5" fill={COLORS.pink} opacity={0.35} />
          <Ellipse cx="82" cy="72" rx="8" ry="5" fill={COLORS.pink} opacity={0.35} />

          {/* Eyes */}
          <Ellipse cx="48" cy="58" rx="6" ry="9" fill="white" stroke={COLORS.ink} strokeWidth="2" />
          <Ellipse cx="49" cy="59" rx="3" ry="3.5" fill={COLORS.ink} />
          <Ellipse cx="50" cy="57" rx="1.5" ry="1.5" fill="white" />

          <Ellipse cx="72" cy="58" rx="6" ry="9" fill="white" stroke={COLORS.ink} strokeWidth="2" />
          <Ellipse cx="73" cy="59" rx="3" ry="3.5" fill={COLORS.ink} />
          <Ellipse cx="74" cy="57" rx="1.5" ry="1.5" fill="white" />

          {/* Mouth */}
          {pose === 'mic' ? (
            <Ellipse cx="60" cy="84" rx="6" ry="4" fill={COLORS.ink} />
          ) : (
            <Path d="M50 84 Q60 93 70 84" fill={COLORS.ink} />
          )}
        </Svg>

        {/* Animated arm overlay (wave / point) */}
        {(pose === 'wave' || pose === 'point') && (
          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, width: size, height: size },
              armStyle,
            ]}
          >
            <Svg viewBox="0 0 120 120" width="100%" height="100%">
              {pose === 'wave' && (
                <Path d="M82 60 Q100 40 96 30" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
              )}
              {pose === 'point' && (
                <>
                  <Path d="M82 60 Q104 55 108 50" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
                  <Circle cx="108" cy="48" r="5" fill={color} stroke={COLORS.ink} strokeWidth="2" />
                </>
              )}
            </Svg>
          </Animated.View>
        )}

        {/* Animated hat overlay */}
        <Animated.View
          style={[
            { position: 'absolute', top: 0, left: 0, width: size, height: size },
            hatStyle,
          ]}
        >
          <Svg viewBox="0 0 120 120" width="100%" height="100%">
            {/* Hat: tip at top (y≈0), base sitting on head (y≈24) */}
            <Path d="M44 24 L60 1 L76 24 Z" fill={hat} stroke={COLORS.ink} strokeWidth="2" strokeLinejoin="round" />
            {/* Stripe */}
            <Path d="M49 18 L71 18" stroke={COLORS.cream} strokeWidth="2" strokeLinecap="round" opacity={0.7} />
            {/* Pompom */}
            <Circle cx="60" cy="1" r="4.5" fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth="1.5" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
