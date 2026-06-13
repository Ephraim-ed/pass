import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Bub from '@/components/mascot/Bub';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import HoldCard from '@/features/imposter/HoldCard';
import { useImposter } from '@/features/imposter/useImposter';
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
        backgroundColor: COLORS.cream,
      }}
    >
      <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkSoft, letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

export default function ImposterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const game = useImposter(state.players);

  const tooFewPlayers = state.players.length < 3;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream2 }}>
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 12, left: 16, zIndex: 10, padding: 8 }}
      >
        <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}>← Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: 48, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── INTRO ── */}
        {game.phase === 'intro' && (
          <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Bub pose="point" size={140} color={COLORS.tomato} />

            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 40,
                color: COLORS.ink,
                lineHeight: 40 * 0.98,
                letterSpacing: -1,
                textAlign: 'center',
                marginTop: 24,
                marginBottom: 16,
              }}
            >
              Who's the{'\n'}Imposter
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <MetaPill label={`${state.players.length} players`} />
              <MetaPill label="~12 min" />
              <MetaPill label="Sneaky" />
            </View>

            <Sticker color={COLORS.cream} radius={RADIUS.xl} shadowY={3} style={{ width: '100%', marginBottom: 20 }}>
              <View style={{ padding: 16 }}>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.inkSoft, lineHeight: 22 }}>
                  Pass the phone around. Everyone holds the card to see the secret word — except the imposter, who only gets a vague clue. Take turns describing the word, then vote: who's faking it?
                </Text>
              </View>
            </Sticker>

            {/* Pack picker */}
            <View style={{ width: '100%', marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: COLORS.ink2,
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}
              >
                WORD PACKS
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {game.packs.map((pack) => {
                  const active = game.selectedPacks.includes(pack.id);
                  return (
                    <Pressable
                      key={pack.id}
                      onPress={() => game.togglePack(pack.id)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        borderRadius: RADIUS.pill,
                        borderWidth: 2,
                        borderColor: COLORS.ink,
                        backgroundColor: active ? COLORS.ink : COLORS.cream,
                      }}
                    >
                      <Text style={{ fontFamily: FONTS.uiBold, fontSize: 13, color: active ? COLORS.cream : COLORS.ink }}>
                        {pack.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {tooFewPlayers ? (
              <Sticker color={COLORS.yellow} radius={RADIUS.pill} shadowY={3} style={{ width: '100%' }}>
                <Text
                  style={{
                    fontFamily: FONTS.uiBold,
                    fontSize: 15,
                    color: COLORS.ink,
                    textAlign: 'center',
                    paddingVertical: 18,
                  }}
                >
                  Needs at least 3 players
                </Text>
              </Sticker>
            ) : (
              <StickerButton color={COLORS.tomato} radius={RADIUS.pill} onPress={game.startRound} style={{ width: '100%' }}>
                <Text
                  style={{
                    fontFamily: FONTS.uiBold,
                    fontSize: 18,
                    color: COLORS.ink,
                    textAlign: 'center',
                    paddingVertical: 18,
                  }}
                >
                  Deal the cards
                </Text>
              </StickerButton>
            )}
          </View>
        )}

        {/* ── REVEAL (pass the phone) ── */}
        {game.phase === 'reveal' && (
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.ink2,
                letterSpacing: 1.5,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              CARD {game.revealIdx + 1} OF {game.playerCount}
            </Text>

            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 30,
                color: COLORS.ink,
                textAlign: 'center',
                marginBottom: 6,
              }}
            >
              Pass to {game.currentPlayer}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.ui,
                fontSize: 14,
                color: COLORS.ink2,
                textAlign: 'center',
                marginBottom: 28,
              }}
            >
              Make sure no one else can see the screen.
            </Text>

            <HoldCard
              key={game.revealIdx}
              backColor={game.isImposter ? COLORS.tomato : COLORS.mint}
            >
              {game.isImposter ? (
                <>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink, letterSpacing: 1.5, marginBottom: 10, opacity: 0.7 }}>
                    YOU'RE THE IMPOSTER
                  </Text>
                  <Text style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink, textAlign: 'center', marginBottom: 12 }}>
                    Blend in 🤫
                  </Text>
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.ink, textAlign: 'center' }}>
                    Your only clue: {game.entry.clue}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink, letterSpacing: 1.5, marginBottom: 10, opacity: 0.7 }}>
                    THE SECRET WORD IS
                  </Text>
                  <Text style={{ fontFamily: FONTS.display, fontSize: 36, color: COLORS.ink, textAlign: 'center' }}>
                    {game.entry.word}
                  </Text>
                </>
              )}
            </HoldCard>

            <View style={{ marginTop: 'auto', paddingTop: 28 }}>
              <StickerButton color={COLORS.ink} radius={RADIUS.pill} onPress={game.nextReveal}>
                <Text
                  style={{
                    fontFamily: FONTS.uiBold,
                    fontSize: 17,
                    color: COLORS.cream,
                    textAlign: 'center',
                    paddingVertical: 17,
                  }}
                >
                  {game.isLastReveal ? 'Everyone has seen their card' : 'Got it — pass it on'}
                </Text>
              </StickerButton>
            </View>
          </View>
        )}

        {/* ── DISCUSS ── */}
        {game.phase === 'discuss' && (
          <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Bub pose="point" size={130} color={COLORS.tomato} />
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 34,
                color: COLORS.ink,
                textAlign: 'center',
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Time to vote!
            </Text>
            <Sticker color={COLORS.cream} radius={RADIUS.xl} shadowY={3} style={{ width: '100%', marginBottom: 32 }}>
              <View style={{ padding: 16 }}>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.inkSoft, lineHeight: 23, textAlign: 'center' }}>
                  Go around and each say one word describing the secret word. Then everyone points at who they think is faking. Ready for the reveal?
                </Text>
              </View>
            </Sticker>
            <StickerButton color={COLORS.tomato} radius={RADIUS.pill} onPress={game.revealResult} style={{ width: '100%' }}>
              <Text
                style={{
                  fontFamily: FONTS.uiBold,
                  fontSize: 18,
                  color: COLORS.ink,
                  textAlign: 'center',
                  paddingVertical: 18,
                }}
              >
                Reveal the imposter
              </Text>
            </StickerButton>
          </View>
        )}

        {/* ── RESULT ── */}
        {game.phase === 'result' && (
          <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Bub pose="cheer" devil size={140} color={COLORS.tomato} />

            <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink2, letterSpacing: 1.5, marginTop: 20, marginBottom: 8 }}>
              THE IMPOSTER WAS
            </Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 44, color: COLORS.ink, textAlign: 'center', marginBottom: 24 }}>
              {game.imposterName}
            </Text>

            <Sticker color={COLORS.mint} radius={RADIUS.xl} rotate={-1.5} style={{ width: '100%', marginBottom: 36 }}>
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink, letterSpacing: 1.5, opacity: 0.7, marginBottom: 8 }}>
                  THE WORD WAS
                </Text>
                <Text style={{ fontFamily: FONTS.display, fontSize: 30, color: COLORS.ink }}>
                  {game.entry.word}
                </Text>
              </View>
            </Sticker>

            <StickerButton color={COLORS.tomato} radius={RADIUS.pill} onPress={game.playAgain} style={{ width: '100%', marginBottom: 12 }}>
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 18, color: COLORS.ink, textAlign: 'center', paddingVertical: 18 }}>
                Play again
              </Text>
            </StickerButton>
            <Pressable onPress={game.backToIntro} style={{ paddingVertical: 12 }}>
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.ink2, textAlign: 'center' }}>
                Change packs
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
