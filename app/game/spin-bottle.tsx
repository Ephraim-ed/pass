import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Ellipse, Path } from 'react-native-svg';
import FlipCard from '@/features/spin-bottle/FlipCard';
import SpinWheel from '@/features/spin-bottle/SpinWheel';
import { useSpinGame } from '@/features/spin-bottle/useSpinGame';
import Bub from '@/components/mascot/Bub';
import SpeechBubble from '@/components/ui/SpeechBubble';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

function MetaPill({ label }: { label: string }) {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: COLORS.ink,
        borderRadius: RADIUS.pill,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
        backgroundColor: COLORS.cream2,
      }}
    >
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkSoft, letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

export default function SpinBottleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const game = useSpinGame(state.players);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream2 }}>
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 12, left: 16, zIndex: 10, padding: 8 }}
      >
        <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}>← Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* INTRO PHASE */}
        {game.phase === 'intro' && (
          <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 42,
                color: COLORS.ink,
                lineHeight: 42 * 0.98,
                letterSpacing: -1,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Spin the Bottle
            </Text>

            {/* Bottle illustration */}
            <View style={{ marginVertical: 24 }}>
              <Svg width={120} height={160} viewBox="0 0 60 80">
                <Ellipse cx="30" cy="72" rx="12" ry="5" fill={COLORS.ink} opacity={0.15} />
                <Path d="M22 28 Q18 18 20 8 L40 8 Q42 18 38 28 Q42 32 42 50 Q42 65 30 65 Q18 65 18 50 Q18 32 22 28 Z"
                  fill={COLORS.mint} stroke={COLORS.ink} strokeWidth="2.5" />
                <Path d="M22 28 Q30 24 38 28" fill="none" stroke={COLORS.ink} strokeWidth="1.5" />
                <Path d="M25 8 L35 8 L34 4 L26 4 Z" fill={COLORS.ink2} stroke={COLORS.ink} strokeWidth="1.5" />
              </Svg>
            </View>

            {/* Rules */}
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <MetaPill label={`${state.players.length} players`} />
              <MetaPill label="~10 min" />
              <MetaPill label="🔊 Loud" />
            </View>

            <Sticker color={COLORS.cream} radius={RADIUS.xl} shadowY={3} style={{ width: '100%', marginBottom: 32 }}>
              <View style={{ padding: 16 }}>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.inkSoft, lineHeight: 22 }}>
                  The bottle spins and picks a player. That player chooses Truth or Dare. Complete the challenge, then spin again!
                </Text>
              </View>
            </Sticker>

            <StickerButton
              color={COLORS.mint}
              radius={RADIUS.pill}
              onPress={game.startGame}
              style={{ width: '100%' }}
            >
              <Text
                style={{
                  fontFamily: FONTS.uiBold,
                  fontSize: 18,
                  color: COLORS.ink,
                  textAlign: 'center',
                  paddingVertical: 18,
                }}
              >
                Start spinning
              </Text>
            </StickerButton>
          </View>
        )}

        {/* SPIN PHASE */}
        {game.phase === 'spin' && (
          <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 34,
                color: COLORS.ink,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              {game.isSpinning
                ? 'Spinning...'
                : game.targetIndex !== null
                ? `${state.players[game.targetIndex]} — pick your fate!`
                : 'Tap Spin!'}
            </Text>

            <SpinWheel
              players={state.players}
              targetIndex={game.targetIndex}
              isSpinning={game.isSpinning}
              onSpin={game.spin}
            />

            {!game.isSpinning && game.targetIndex !== null && (
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
                <StickerButton
                  color={COLORS.purple}
                  radius={RADIUS.xl}
                  onPress={game.pickTruth}
                  style={{ flex: 1 }}
                >
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 18, color: COLORS.cream, textAlign: 'center', paddingVertical: 16 }}>
                    Truth
                  </Text>
                </StickerButton>
                <StickerButton
                  color={COLORS.tomato}
                  radius={RADIUS.xl}
                  onPress={game.pickDare}
                  style={{ flex: 1 }}
                >
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 18, color: COLORS.ink, textAlign: 'center', paddingVertical: 16 }}>
                    Dare
                  </Text>
                </StickerButton>
              </View>
            )}
          </View>
        )}

        {/* RESULT PHASE */}
        {game.phase === 'result' && (
          <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 34,
                color: COLORS.ink,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {game.targetIndex !== null ? state.players[game.targetIndex] : ''}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink2, letterSpacing: 1, marginBottom: 24 }}>
              {game.promptType === 'truth' ? 'CHOSE TRUTH' : 'CHOSE DARE'}
            </Text>

            {/* Bub with speech bubble */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24 }}>
              <Bub pose="mic" size={90} color={COLORS.mint} hat={COLORS.tomato} />
              <View style={{ flex: 1, marginLeft: 8, marginBottom: 20 }}>
                <SpeechBubble text={game.promptType === 'truth' ? "Time to spill the tea! 🍵" : "Let's see what you've got! 😈"} />
              </View>
            </View>

            {/* Flip card */}
            <FlipCard prompt={game.prompt} type={game.promptType} />

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 28, width: '100%' }}>
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
                }}
              >
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.ink }}>Reroll</Text>
              </Pressable>
              <StickerButton
                color={COLORS.mint}
                radius={RADIUS.pill}
                onPress={game.reset}
                style={{ flex: 1 }}
              >
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.ink, textAlign: 'center', paddingVertical: 14 }}>
                  Spin again
                </Text>
              </StickerButton>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
