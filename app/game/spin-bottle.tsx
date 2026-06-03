import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import FlipCard from '@/features/spin-bottle/FlipCard';
import SpinWheel from '@/features/spin-bottle/SpinWheel';
import { useSpinGame } from '@/features/spin-bottle/useSpinGame';
import Bub from '@/components/mascot/Bub';
import SpeechBubble from '@/components/ui/SpeechBubble';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

// ── Shared primitives ─────────────────────────────────────────

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: COLORS.cream,
        borderWidth: 2.5,
        borderColor: COLORS.ink,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.ink,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
      }}
    >
      <Svg width={16} height={14} viewBox="0 0 16 14" fill="none">
        <Path d="M15 7 H1 M7 1 L1 7 L7 13" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: COLORS.ink,
        borderRadius: RADIUS.pill,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: COLORS.cream2,
      }}
    >
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkSoft, letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

function BottleIllo() {
  return (
    <Svg width={80} height={136} viewBox="0 0 60 102">
      {/* ground shadow */}
      <Ellipse cx="30" cy="99" rx="16" ry="3" fill={COLORS.ink} opacity={0.15} />
      {/* bottle body */}
      <Path
        d="M22 24 L22 38 Q10 46 10 60 L10 86 Q10 94 18 94 L42 94 Q50 94 50 86 L50 60 Q50 46 38 38 L38 24 Z"
        fill="#D92020"
        stroke={COLORS.ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* neck shoulder line */}
      <Path d="M22 24 Q30 20 38 24" fill="none" stroke={COLORS.ink} strokeWidth="1.5" />
      {/* neck / cap */}
      <Rect x="22" y="8" width="16" height="18" rx="3" fill={COLORS.ink} />
      {/* label */}
      <Rect x="13" y="57" width="34" height="24" rx="2" fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth="2" />
      <SvgText x="30" y="69" textAnchor="middle" fontFamily="serif" fontWeight="900" fontSize="10" fill="#1A6B1A">
        UFC
      </SvgText>
      <Path d="M17 72 L43 72" stroke="#1A6B1A" strokeWidth="1" />
      <SvgText x="30" y="78" textAnchor="middle" fontFamily="serif" fontSize="4.5" fill="#1A6B1A">
        KETCHUP
      </SvgText>
      {/* shine */}
      <Path d="M14 46 Q13 60 14 84" stroke="rgba(255,255,255,0.65)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function Burst({ size = 80, color = COLORS.yellow }: { size?: number; color?: string }) {
  const n = 12;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? 48 : 32;
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`);
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points={pts.join(' ')} fill={color} stroke={COLORS.ink} strokeWidth="3" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Main screen ───────────────────────────────────────────────

export default function SpinBottleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const game = useSpinGame(state.players);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream2 }}>

      {/* ── INTRO PHASE ── */}
      {game.phase === 'intro' && (
        <View style={{ flex: 1, padding: 22, paddingTop: insets.top + 16 }}>
          <BackButton onPress={() => router.back()} />

          <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* badge */}
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: COLORS.ink,
                borderRadius: RADIUS.pill,
                paddingHorizontal: 10,
                paddingVertical: 4,
                marginBottom: 14,
              }}
            >
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.cream, letterSpacing: 1.4 }}>
                CLASSIC · 18+
              </Text>
            </View>

            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 52,
                color: COLORS.ink,
                lineHeight: 56,
                letterSpacing: -1.5,
              }}
            >
              {"Spin the\nBottle."}
            </Text>

            <Text
              style={{
                fontFamily: FONTS.ui,
                fontSize: 16,
                color: COLORS.inkSoft,
                lineHeight: 24,
                marginTop: 14,
                maxWidth: 300,
              }}
            >
              Swipe to spin. Whoever it points to picks{' '}
              <Text style={{ fontFamily: FONTS.uiBold }}>Truth</Text> or{' '}
              <Text style={{ fontFamily: FONTS.uiBold }}>Dare</Text>. Pass the phone. Repeat until someone cries.
            </Text>

            {/* bottle illustration */}
            <View style={{ alignItems: 'flex-start', marginTop: 28, height: 150, position: 'relative' }}>
              <View style={{ marginLeft: 40 }}>
                <BottleIllo />
              </View>
              <View style={{ position: 'absolute', top: 10, right: 40 }}>
                <Burst size={40} color={COLORS.yellow} />
              </View>
              <View style={{ position: 'absolute', bottom: 16, left: 46 }}>
                <Burst size={28} color={COLORS.pink} />
              </View>
            </View>

            {/* meta pills */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
              <MetaPill label={`${state.players.length} players`} />
              <MetaPill label="~10 min" />
              <MetaPill label="Loud" />
            </View>
          </View>

          <StickerButton color={COLORS.pink} radius={RADIUS.pill} shadowY={5} onPress={game.startGame}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 20 }}>
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 18, color: COLORS.ink }}>
                Start spinning
              </Text>
              <Svg width={18} height={14} viewBox="0 0 18 14" fill="none">
                <Path d="M1 7 H16 M10 1 L16 7 L10 13" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </StickerButton>
        </View>
      )}

      {/* ── SPIN PHASE ── */}
      {game.phase === 'spin' && (
        <View style={{ flex: 1, paddingTop: insets.top + 16, paddingBottom: 40 }}>
          {/* top nav */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22 }}>
            <BackButton onPress={() => game.resetToIntro()} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.ink2, letterSpacing: 1.4 }}>
                ROUND {game.round}
              </Text>
              <Text style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.ink, letterSpacing: -0.4 }}>
                Spin the Bottle
              </Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          {/* spin wheel */}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <SpinWheel
              players={state.players}
              targetIndex={game.targetIndex}
              isSpinning={game.isSpinning}
              onSpin={game.spin}
            />
            {!game.isSpinning && game.targetIndex === null && (
              <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink2, letterSpacing: 1.2 }}>
                SWIPE TO SPIN
              </Text>
            )}
          </View>

          {/* Truth/Dare CTA — only after spin lands */}
          {!game.isSpinning && game.targetIndex !== null && (
            <View style={{ paddingHorizontal: 22, alignItems: 'center', gap: 10 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1.4 }}>
                POINTING AT
              </Text>
              <Text style={{ fontFamily: FONTS.display, fontSize: 30, color: COLORS.ink, letterSpacing: -0.7 }}>
                {state.players[game.targetIndex]}
              </Text>
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <StickerButton color={COLORS.purple} radius={RADIUS.xl} onPress={game.pickTruth} style={{ flex: 1 }}>
                  <View style={{ padding: 18, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.cream, letterSpacing: -0.5 }}>
                      TRUTH
                    </Text>
                    <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.cream, opacity: 0.8, letterSpacing: 1, marginTop: 2 }}>
                      tell all
                    </Text>
                  </View>
                </StickerButton>
                <StickerButton color={COLORS.tomato} radius={RADIUS.xl} onPress={game.pickDare} style={{ flex: 1 }}>
                  <View style={{ padding: 18, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.cream, letterSpacing: -0.5 }}>
                      DARE
                    </Text>
                    <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.cream, opacity: 0.8, letterSpacing: 1, marginTop: 2 }}>
                      do it
                    </Text>
                  </View>
                </StickerButton>
              </View>
            </View>
          )}
        </View>
      )}

      {/* ── RESULT PHASE ── */}
      {game.phase === 'result' && (
        <View style={{ flex: 1, paddingTop: insets.top + 16, paddingHorizontal: 22, paddingBottom: 40 }}>
          <BackButton onPress={() => game.resetToIntro()} />

          {/* player name + Bub */}
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1.4 }}>
              BOTTLE PICKED
            </Text>
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 38,
                color: COLORS.ink,
                letterSpacing: -1,
                lineHeight: 38,
                marginTop: 8,
              }}
            >
              {game.targetIndex !== null ? state.players[game.targetIndex] : ''}
            </Text>

            {/* Bub commentating */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              <View style={{ transform: [{ translateY: 6 }] }}>
                <Bub pose="mic" size={70} color={COLORS.mint} hat={COLORS.tomato} />
              </View>
              <View style={{ marginBottom: 14 }}>
                <SpeechBubble
                  text={
                    game.promptType === 'truth'
                      ? "Ooooh — no escape!"
                      : "Let's see what you've got!"
                  }
                />
              </View>
            </View>
          </View>

          {/* flip card */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <FlipCard prompt={game.prompt} type={game.promptType} />
          </View>

          {/* action buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={game.reroll}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: RADIUS.pill,
                borderWidth: 2.5,
                borderColor: COLORS.ink,
                backgroundColor: COLORS.cream,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <Path d="M11 7 Q11 11 7 11 Q3 11 3 7 Q3 3 7 3 Q9.5 3 11 5" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
                <Path d="M9 1 L11 5 L7 5" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </Svg>
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.ink }}>Reroll</Text>
            </Pressable>
            <StickerButton color={COLORS.pink} radius={RADIUS.pill} onPress={game.reset} style={{ flex: 1.4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14 }}>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.ink }}>
                  Spin again
                </Text>
                <Svg width={14} height={12} viewBox="0 0 18 14" fill="none">
                  <Path d="M1 7 H16 M10 1 L16 7 L10 13" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </StickerButton>
          </View>
        </View>
      )}
    </View>
  );
}
