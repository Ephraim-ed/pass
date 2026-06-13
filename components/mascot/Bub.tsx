import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { COLORS } from "@/theme/tokens";

export type BubPose =
  | "idle"
  | "wave"
  | "point"
  | "mic"
  | "cheer"
  | "peek"
  | "dance"
  | "sleep"
  | "surprised"
  | "shrug"
  | "laugh";

type Props = {
  pose?: BubPose;
  size?: number;
  color?: string;
  /** Adds devil horns + a mischievous brow. Used for the imposter reveal. */
  devil?: boolean;
};

export default function Bub({
  pose = "idle",
  size = 120,
  color = COLORS.yellow,
  devil = false,
}: Props) {
  const bodyRot = useSharedValue(0);
  const bodyY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const armRot = useSharedValue(0);
  const eyeX = useSharedValue(0);
  const leftArmY = useSharedValue(0);

  useEffect(() => {
    // Reset all animations
    bodyRot.value = 0;
    bodyY.value = 0;
    bodyScale.value = 1;
    armRot.value = 0;
    eyeX.value = 0;
    leftArmY.value = 0;

    if (pose === "idle" || pose === "sleep") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-1.5, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
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
    } else if (pose === "wave") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-1.5, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
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
      armRot.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 700 }),
          withTiming(28, { duration: 700 }),
        ),
        -1,
        true,
      );
    } else if (pose === "point") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-1.5, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
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
      armRot.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 800 }),
          withTiming(2, { duration: 800 }),
        ),
        -1,
        true,
      );
    } else if (pose === "mic") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-1.5, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
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
      armRot.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(2, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else if (pose === "cheer") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-1.5, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
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
      bodyScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 500 }),
          withTiming(1, { duration: 500 }),
        ),
        -1,
        true,
      );
      armRot.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 600 }),
          withTiming(5, { duration: 600 }),
        ),
        -1,
        true,
      );
      leftArmY.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 600 }),
          withTiming(0, { duration: 600 }),
        ),
        -1,
        true,
      );
    } else if (pose === "laugh") {
      // Laugh: rapid belly-bounce, slight forward tilt, no side-to-side
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 350, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 350, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      bodyY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 350, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 350, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      bodyScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 350 }),
          withTiming(1, { duration: 350 }),
        ),
        -1,
        true,
      );
      // Minimal arm wiggle — not flapping
      armRot.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 350 }),
          withTiming(-2, { duration: 350 }),
        ),
        -1,
        true,
      );
      leftArmY.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(-1, { duration: 350 }),
        ),
        -1,
        true,
      );
    } else if (pose === "peek") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      bodyY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      eyeX.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(-2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      armRot.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1000 }),
          withTiming(3, { duration: 1000 }),
        ),
        -1,
        true,
      );
    } else if (pose === "dance") {
      bodyRot.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 400, easing: Easing.inOut(Easing.sin) }),
          withTiming(5, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      bodyY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      armRot.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 400 }),
          withTiming(15, { duration: 400 }),
        ),
        -1,
        true,
      );
      leftArmY.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 400 }),
          withTiming(-5, { duration: 400 }),
        ),
        -1,
        true,
      );
    } else if (pose === "surprised") {
      bodyScale.value = withTiming(1.08, { duration: 200 });
      armRot.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 400 }),
          withTiming(3, { duration: 400 }),
        ),
        -1,
        true,
      );
      leftArmY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 400 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
        true,
      );
    } else if (pose === "shrug") {
      armRot.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 800 }),
          withTiming(3, { duration: 800 }),
        ),
        -1,
        true,
      );
      leftArmY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 800 }),
          withTiming(0, { duration: 800 }),
        ),
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

  const armStyle = useAnimatedStyle(() => {
    const pivotX = ((100 - 60) / 120) * size;
    const pivotY = ((74 - 60) / 120) * size;
    return {
      transform: [
        { translateX: pivotX },
        { translateY: pivotY },
        { rotate: `${armRot.value}deg` },
        { translateX: -pivotX },
        { translateY: -pivotY },
      ],
    };
  });

  const leftArmStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: leftArmY.value }],
  }));

  const eyeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: eyeX.value }],
  }));

  // Pose layout flags
  const showStaticLeftArm =
    pose === "idle" ||
    pose === "sleep" ||
    pose === "wave" ||
    pose === "point" ||
    pose === "mic";
  const showStaticRightArm = pose === "idle" || pose === "sleep";
  const showRightArmOverlay =
    pose === "wave" ||
    pose === "point" ||
    pose === "cheer" ||
    pose === "peek" ||
    pose === "surprised" ||
    pose === "dance" ||
    pose === "shrug" ||
    pose === "laugh";
  const showLeftArmOverlay =
    pose === "cheer" ||
    pose === "peek" ||
    pose === "surprised" ||
    pose === "dance" ||
    pose === "shrug" ||
    pose === "laugh";

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
          <Ellipse
            cx="60"
            cy="112"
            rx="28"
            ry="6"
            fill={COLORS.ink}
            opacity={0.15}
          />

          {/* Left arm — static, behind body */}
          {showStaticLeftArm && (
            <>
              {/* Left arm outline */}
              <Path
                d="M24 74 Q20 76 18 78"
                stroke={COLORS.ink}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left arm fill */}
              <Path
                d="M24 74 Q20 76 18 78"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Right arm — static, behind body */}
          {showStaticRightArm && (
            <>
              {/* Right arm outline — same visible length as left arm */}
              <Path
                d="M96 74 Q100 76 102 78"
                stroke={COLORS.ink}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right arm fill */}
              <Path
                d="M96 74 Q100 76 102 78"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Mic pose — right arm holding mic pointed at mouth */}
          {pose === "mic" && (
            <>
              {/* Right arm outline — curves toward mouth */}
              <Path
                d="M96 74 Q100 76 104 78"
                stroke={COLORS.ink}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right arm fill */}
              <Path
                d="M96 74 Q100 76 104 78"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Mic handle */}
              <Rect
                x="102"
                y="80"
                width="6"
                height="6"
                rx="1"
                fill={COLORS.ink}
              />
              {/* Mic head — at the mouth level */}
              <Circle
                cx="104"
                cy="78"
                r="6"
                fill={COLORS.ink2}
                stroke={COLORS.ink}
                strokeWidth="2"
              />
            </>
          )}

          {/* Devil horns — drawn before the body so its top edge hides the base */}
          {devil && (
            <>
              {/* Left horn */}
              <Path
                d="M38 30 Q29 16 33 5 Q42 16 47 28 Z"
                fill={color}
                stroke={COLORS.ink}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Right horn */}
              <Path
                d="M82 30 Q91 16 87 5 Q78 16 73 28 Z"
                fill={color}
                stroke={COLORS.ink}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Cute Blob Body */}
          <Path
            d="M60 18
               C38 18, 20 32, 20 56
               C20 72, 24 88, 34 98
               C40 104, 50 106, 60 106
               C70 106, 80 104, 86 98
               C96 88, 100 72, 100 56
               C100 32, 82 18, 60 18
               Z"
            fill={color}
            stroke={COLORS.ink}
            strokeWidth="2.5"
          />
          <Path
            d="M60 18
               C38 18, 20 32, 20 56
               C20 72, 24 88, 34 98
               C40 104, 50 106, 60 106
               C70 106, 80 104, 86 98
               C96 88, 100 72, 100 56
               C100 32, 82 18, 60 18
               Z"
            fill={`url(#grad_${pose})`}
          />

          {/* Little feet */}
          <Ellipse
            cx="42"
            cy="104"
            rx="9"
            ry="5"
            fill={color}
            stroke={COLORS.ink}
            strokeWidth="2"
          />
          <Ellipse
            cx="78"
            cy="104"
            rx="9"
            ry="5"
            fill={color}
            stroke={COLORS.ink}
            strokeWidth="2"
          />

          {/* Blush */}
          <Ellipse
            cx="36"
            cy="68"
            rx="7"
            ry="4"
            fill={COLORS.pink}
            opacity={0.35}
          />
          <Ellipse
            cx="84"
            cy="68"
            rx="7"
            ry="4"
            fill={COLORS.pink}
            opacity={0.35}
          />

          {/* Mouth */}
          {(pose === "idle" ||
            pose === "wave" ||
            pose === "point" ||
            pose === "dance" ||
            pose === "shrug") && (
            <Path
              d="M50 76 Q60 84 70 76"
              fill="none"
              stroke={COLORS.ink}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {(pose === "mic" || pose === "peek" || pose === "surprised") && (
            <Ellipse cx="60" cy="78" rx="5" ry="4" fill={COLORS.ink} />
          )}
          {pose === "sleep" && (
            <Path
              d="M54 78 Q60 82 66 78"
              fill="none"
              stroke={COLORS.ink}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {pose === "cheer" && (
            <Ellipse cx="60" cy="78" rx="6" ry="5" fill={COLORS.ink} />
          )}
          {pose === "laugh" && (
            <Ellipse cx="60" cy="78" rx="6" ry="5" fill={COLORS.ink} />
          )}
        </Svg>

        {/* Eye overlay */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: size,
              height: size,
            },
            eyeStyle,
          ]}
        >
          <Svg viewBox="0 0 120 120" width="100%" height="100%">
            {pose === "sleep" ? (
              <>
                {/* Single closed eye — centered at x=60 like the open eye */}
                <Path
                  d="M46 48 Q60 54 74 48"
                  fill="none"
                  stroke={COLORS.ink}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <Circle
                  cx="60"
                  cy="48"
                  r="19"
                  fill="white"
                  stroke={COLORS.ink}
                  strokeWidth="2.5"
                />
                <Circle cx="60" cy="48" r="11" fill={COLORS.ink} />
                <Circle cx="60" cy="48" r="5" fill={COLORS.ink2} />
                <Circle cx="54" cy="42" r="4" fill="white" opacity={0.9} />
                <Circle cx="64" cy="52" r="1.5" fill="white" opacity={0.5} />
              </>
            )}
          </Svg>
        </Animated.View>

        {/* Animated right arm overlay */}
        {showRightArmOverlay && (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
              },
              armStyle,
            ]}
          >
            <Svg viewBox="0 0 120 120" width="100%" height="100%">
              {pose === "wave" && (
                <>
                  <Path
                    d="M100 74 Q108 64 106 58"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q108 64 106 58"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "point" && (
                <>
                  <Path
                    d="M100 74 Q108 70 112 68"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q108 70 112 68"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Finger tip — no outline */}
                  <Circle cx="112" cy="68" r="4" fill={color} />
                </>
              )}
              {pose === "cheer" && (
                <>
                  <Path
                    d="M100 74 Q108 58 106 52"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q108 58 106 52"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "laugh" && (
                <>
                  {/* Laugh: right arm stays near body, small wiggle */}
                  <Path
                    d="M100 74 Q106 78 108 80"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q106 78 108 80"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}

              {pose === "peek" && (
                <>
                  {/* Arm near mouth */}
                  <Path
                    d="M100 74 Q98 66 96 62"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q98 66 96 62"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "surprised" && (
                <>
                  {/* Arm on cheek */}
                  <Path
                    d="M100 74 Q96 60 94 58"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q96 60 94 58"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "dance" && (
                <>
                  <Path
                    d="M100 74 Q104 60 102 54"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q104 60 102 54"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "shrug" && (
                <>
                  <Path
                    d="M100 74 Q104 68 108 66"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M100 74 Q104 68 108 66"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
            </Svg>
          </Animated.View>
        )}

        {/* Animated left arm overlay */}
        {showLeftArmOverlay && (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height: size,
              },
              leftArmStyle,
            ]}
          >
            <Svg viewBox="0 0 120 120" width="100%" height="100%">
              {pose === "cheer" && (
                <>
                  <Path
                    d="M24 74 Q18 58 20 52"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M24 74 Q18 58 20 52"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "laugh" && (
                <>
                  {/* Laugh: left arm stays near body, small wiggle */}
                  <Path
                    d="M24 74 Q18 78 16 80"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M24 74 Q18 78 16 80"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "peek" && (
                <>
                  {/* Arm near mouth */}
                  <Path
                    d="M24 74 Q26 66 28 62"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M24 74 Q26 66 28 62"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "surprised" && (
                <>
                  {/* Arm on cheek */}
                  <Path
                    d="M24 74 Q28 60 30 58"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M24 74 Q28 60 30 58"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "dance" && (
                <>
                  <Path
                    d="M24 74 Q20 60 22 54"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M24 74 Q20 60 22 54"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              {pose === "shrug" && (
                <>
                  <Path
                    d="M24 74 Q20 68 16 66"
                    stroke={COLORS.ink}
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Path
                    d="M24 74 Q20 68 16 66"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
            </Svg>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
