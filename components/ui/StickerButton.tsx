import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, RADIUS } from '@/theme/tokens';

type Props = {
  color: string;
  radius?: number;
  shadowY?: number;
  rotate?: number;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export default function StickerButton({
  color,
  radius = RADIUS.lg,
  shadowY = 5,
  rotate = 0,
  onPress,
  style,
  children,
}: Props) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate}deg` },
      { translateY: pressed.value * 3 },
      { scale: 1 - pressed.value * 0.02 },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    top: shadowY - pressed.value * 3,
  }));

  return (
    <Pressable
      onPressIn={() => {
        Haptics.selectionAsync();
        pressed.value = withTiming(1, { duration: 80 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 120 });
      }}
      onPress={onPress}
      style={style}
    >
      <AnimatedView style={animStyle}>
        <AnimatedView
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, shadowStyle, { borderRadius: radius, backgroundColor: COLORS.ink }]}
        />
        <View
          style={{ borderRadius: radius, borderWidth: 2.5, borderColor: COLORS.ink, backgroundColor: color }}
        >
          {children}
        </View>
      </AnimatedView>
    </Pressable>
  );
}
