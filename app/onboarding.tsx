import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import Dots from '@/components/ui/Dots';
import StickerButton from '@/components/ui/StickerButton';
import Bub from '@/components/mascot/Bub';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

const STEPS = [
  {
    badge: 'MEET YOUR HOST',
    headline: 'Bub runs\nthe show.',
    body: 'Your MC for 11 party games. One phone, no accounts, all chaos.',
    pose: 'wave' as const,
    color: COLORS.yellow,
    hat: COLORS.pink,
    bg: COLORS.cream2,
  },
  {
    badge: 'HOW IT WORKS',
    headline: 'Tap, play,\npass it on.',
    body: "No sign-ups. No downloads. Just tap a game and hand the phone around.",
    pose: 'point' as const,
    color: COLORS.mint,
    hat: COLORS.tomato,
    bg: '#E9D7FF',
  },
  {
    badge: 'OFFLINE',
    headline: 'Works on\nairplane mode.',
    body: 'Zero signal required. Everything lives right here on the device.',
    pose: 'cheer' as const,
    color: COLORS.sky,
    hat: COLORS.yellow,
    bg: '#D4F5E9',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { setOnboarded } = useApp();

  // Mirror step in a shared value so the worklet can read it
  const stepSV = useSharedValue(0);

  const goNext = useCallback(() => {
    setStep((s) => {
      const next = Math.min(s + 1, STEPS.length - 1);
      stepSV.value = next;
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setStep((s) => {
      const prev = Math.max(s - 1, 0);
      stepSV.value = prev;
      return prev;
    });
  }, []);

  const gesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50 && stepSV.value < STEPS.length - 1) {
      runOnJS(goNext)();
    } else if (e.translationX > 50 && stepSV.value > 0) {
      runOnJS(goPrev)();
    }
  });

  function finish() {
    setOnboarded();
    router.replace('/(tabs)/home');
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ flex: 1, backgroundColor: current.bg }}>
        {/* Skip */}
        <Pressable
          onPress={finish}
          style={{ position: 'absolute', top: 56, right: 24, zIndex: 10, padding: 8 }}
        >
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.ink2, letterSpacing: 1 }}>
            SKIP
          </Text>
        </Pressable>

        {/* Content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View style={{ marginBottom: 32 }}>
            <Bub pose={current.pose} size={160} color={current.color} hat={current.hat} />
          </View>

          <View
            style={{
              backgroundColor: COLORS.ink,
              borderRadius: RADIUS.pill,
              paddingHorizontal: 14,
              paddingVertical: 6,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.cream, letterSpacing: 1.5 }}>
              {current.badge}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: FONTS.display,
              fontSize: 42,
              color: COLORS.ink,
              lineHeight: 42 * 0.98,
              letterSpacing: -42 * 0.025,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {current.headline}
          </Text>

          <Text
            style={{
              fontFamily: FONTS.ui,
              fontSize: 16,
              color: COLORS.inkSoft,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 48,
            }}
          >
            {current.body}
          </Text>

          <Dots total={STEPS.length} active={step} />
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
          <StickerButton
            color={COLORS.ink}
            radius={RADIUS.pill}
            onPress={isLast ? finish : goNext}
            style={{ overflow: 'visible' }}
          >
            <Text
              style={{
                fontFamily: FONTS.uiBold,
                fontSize: 18,
                color: COLORS.cream,
                textAlign: 'center',
                paddingVertical: 18,
              }}
            >
              {isLast ? "Let's go!" : 'Next'}
            </Text>
          </StickerButton>
        </View>
      </View>
    </GestureDetector>
  );
}
