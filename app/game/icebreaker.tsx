import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Bub from '@/components/mascot/Bub';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import { useIcebreaker } from '@/features/icebreaker/useIcebreaker';
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

export default function IcebreakerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const game = useIcebreaker(state.players);

  const avatar = state.avatars[game.currentPlayer];

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
        {/* INTRO */}
        {game.phase === 'intro' && (
          <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Bub pose="wave" size={140} color={COLORS.mint} hat={COLORS.sky} />

            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 42,
                color: COLORS.ink,
                lineHeight: 42 * 0.98,
                letterSpacing: -1,
                textAlign: 'center',
                marginTop: 24,
                marginBottom: 16,
              }}
            >
              Icebreakers
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <MetaPill label={`${state.players.length} players`} />
              <MetaPill label="~10 min" />
              <MetaPill label="Chill" />
            </View>

            <Sticker color={COLORS.cream} radius={RADIUS.xl} shadowY={3} style={{ width: '100%', marginBottom: 32 }}>
              <View style={{ padding: 16 }}>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.inkSoft, lineHeight: 22 }}>
                  Read your question out loud and answer it honestly — stories beat one-word answers. Then pass the phone to the next player. No skipping unless the group allows it!
                </Text>
              </View>
            </Sticker>

            <StickerButton
              color={COLORS.mint}
              radius={RADIUS.pill}
              onPress={game.start}
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
                Break the ice
              </Text>
            </StickerButton>
          </View>
        )}

        {/* PLAYING */}
        {game.phase === 'playing' && (
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Round counter */}
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.ink2,
                letterSpacing: 1.5,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              ROUND {game.round}
            </Text>

            {/* Current player */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: COLORS.mint,
                  borderWidth: 2.5,
                  borderColor: COLORS.ink,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                {avatar ? (
                  <Image source={{ uri: avatar }} style={{ width: 64, height: 64 }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink }}>
                    {game.currentPlayer.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.ink }}>
                {game.currentPlayer}, you're up
              </Text>
            </View>

            {/* Question card */}
            <Sticker color={COLORS.mint} radius={RADIUS.xl} rotate={-1.5} style={{ marginBottom: 36, marginHorizontal: 4 }}>
              <View style={{ padding: 28, minHeight: 180, justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    color: COLORS.ink,
                    letterSpacing: 1.5,
                    marginBottom: 14,
                    opacity: 0.6,
                  }}
                >
                  YOUR QUESTION
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 24,
                    color: COLORS.ink,
                    lineHeight: 30,
                  }}
                >
                  {game.question}
                </Text>
              </View>
            </Sticker>

            {/* Actions */}
            <View style={{ marginTop: 'auto' }}>
              <StickerButton
                color={COLORS.ink}
                radius={RADIUS.pill}
                onPress={game.next}
              >
                <Text
                  style={{
                    fontFamily: FONTS.uiBold,
                    fontSize: 17,
                    color: COLORS.cream,
                    textAlign: 'center',
                    paddingVertical: 17,
                  }}
                >
                  Pass to {game.nextPlayer} →
                </Text>
              </StickerButton>

              <Pressable onPress={game.skip} style={{ paddingVertical: 16 }}>
                <Text
                  style={{
                    fontFamily: FONTS.uiBold,
                    fontSize: 14,
                    color: COLORS.ink2,
                    textAlign: 'center',
                  }}
                >
                  Swap question
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
