import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '@/theme/tokens';

type Props = {
  total: number;
  active: number;
};

function Dot({ isActive }: { isActive: boolean }) {
  const width = useSharedValue(isActive ? 28 : 10);

  useEffect(() => {
    width.value = withTiming(isActive ? 28 : 10, { duration: 200 });
  }, [isActive]);

  const style = useAnimatedStyle(() => ({
    width: width.value,
    height: 10,
    borderRadius: 5,
    backgroundColor: isActive ? COLORS.ink : COLORS.ink2,
    marginHorizontal: 4,
  }));

  return <Animated.View style={style} />;
}

export default function Dots({ total, active }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} isActive={i === active} />
      ))}
    </View>
  );
}
