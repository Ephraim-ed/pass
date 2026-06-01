import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryPills from '@/components/shared/CategoryPills';
import PlayerChip from '@/components/shared/PlayerChip';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import TabBar from '@/components/ui/TabBar';
import Bub from '@/components/mascot/Bub';
import GameIcon from '@/components/game-icons/GameIcon';
import { GAMES, Game } from '@/data/games';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'tonight';
}

function GameCard({ game, onPress }: { game: Game; onPress: () => void }) {
  return (
    <StickerButton color={game.color} onPress={onPress} style={{ flex: 1, margin: 6 }}>
      <View style={{ padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <GameIcon gameId={game.id} size={44} color={COLORS.cream} />
          {game.age === '18+' && (
            <View
              style={{
                backgroundColor: COLORS.ink,
                borderRadius: RADIUS.pill,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.cream, letterSpacing: 1 }}>18+</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.ink, marginBottom: 4 }} numberOfLines={2}>
            {game.name}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.inkSoft, letterSpacing: 0.5 }}>
            {game.tag} · {game.mins}min
          </Text>
        </View>
      </View>
    </StickerButton>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, setCategory, addPlayer, removePlayer } = useApp();
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [newName, setNewName] = useState('');

  const filtered =
    state.category === 'all'
      ? GAMES
      : GAMES.filter((g) => g.cat === state.category);

  const ACCENT_COLORS = [COLORS.mint, COLORS.yellow, COLORS.pink, COLORS.sky, COLORS.purple, COLORS.tomato];

  function handleGamePress(game: Game) {
    if (game.id === 'spin_bottle') {
      router.push('/game/spin-bottle');
    } else {
      router.push(`/game/${game.id}`);
    }
  }

  function submitPlayer() {
    const name = newName.trim();
    if (name && !state.players.includes(name)) {
      addPlayer(name);
    }
    setNewName('');
    setAddingPlayer(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 16, marginBottom: 20 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink2, letterSpacing: 1.5 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()} · {timeGreeting().toUpperCase()}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.display,
              fontSize: 38,
              color: COLORS.ink,
              lineHeight: 38 * 0.98,
              letterSpacing: -38 * 0.025,
              marginTop: 4,
            }}
          >
            Let's get loud.
          </Text>
        </View>

        {/* Crew card */}
        <View style={{ marginHorizontal: 20, marginBottom: 20, paddingTop: 8 }}>
          <Sticker color={COLORS.ink} radius={RADIUS.xl}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.cream2, letterSpacing: 1.5, flex: 1 }}>
                  TONIGHT'S CREW
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.pink,
                    borderRadius: RADIUS.pill,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1.5,
                    borderColor: COLORS.cream,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 12, color: COLORS.ink }}>
                    {state.players.length}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {state.players.map((p, i) => (
                  <PlayerChip
                    key={p}
                    name={p}
                    accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                    removable={state.players.length > 2}
                    onRemove={() => removePlayer(p)}
                  />
                ))}
              </View>

              {addingPlayer ? (
                <TextInput
                  autoFocus
                  value={newName}
                  onChangeText={setNewName}
                  onSubmitEditing={submitPlayer}
                  onBlur={() => setAddingPlayer(false)}
                  placeholder="Player name"
                  placeholderTextColor={COLORS.ink2}
                  returnKeyType="done"
                  style={{
                    fontFamily: FONTS.ui,
                    fontSize: 14,
                    color: COLORS.cream,
                    borderBottomWidth: 1.5,
                    borderBottomColor: COLORS.cream2,
                    paddingVertical: 8,
                    marginTop: 8,
                  }}
                />
              ) : (
                <Pressable onPress={() => setAddingPlayer(true)} style={{ marginTop: 4 }}>
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 13, color: COLORS.cream2 }}>+ Add player</Text>
                </Pressable>
              )}
            </View>
          </Sticker>
        </View>

        {/* Category filter */}
        <View style={{ marginBottom: 20 }}>
          <CategoryPills active={state.category} onSelect={setCategory} />
        </View>

        {/* Featured card (only on All tab) */}
        {state.category === 'all' && (
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1.5, marginBottom: 10 }}>
              BUB'S PICK FOR TONIGHT
            </Text>
            <StickerButton
              color={COLORS.pink}
              radius={RADIUS.xl}
              onPress={() => router.push('/game/spin-bottle')}
            >
              <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center', overflow: 'hidden' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.ink, lineHeight: 28, marginBottom: 8 }}>
                    Spin the Bottle
                  </Text>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkSoft, letterSpacing: 0.5 }}>
                    3–12 players · ~10 min
                  </Text>
                </View>
                <View style={{ position: 'absolute', right: -10, bottom: -10 }}>
                  <Bub pose="peek" size={100} color={COLORS.yellow} hat={COLORS.purple} />
                </View>
              </View>
            </StickerButton>
          </View>
        )}

        {/* Game grid */}
        <View style={{ paddingHorizontal: 14 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {filtered.map((game) => (
              <View key={game.id} style={{ width: '50%' }}>
                <GameCard game={game} onPress={() => handleGamePress(game)} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TabBar />
    </View>
  );
}
