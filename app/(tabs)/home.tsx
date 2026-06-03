import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryPills from '@/components/shared/CategoryPills';
import PlayerChip from '@/components/shared/PlayerChip';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import TabBar from '@/components/ui/TabBar';
import Bub from '@/components/mascot/Bub';
import GameIcon from '@/components/game-icons/GameIcon';
import { GAMES, Game, CATEGORIES } from '@/data/games';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

// ── Decorative primitives ─────────────────────────────────────

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

function Squiggle({ width = 32, height = 14 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 18" fill="none">
      <Path
        d="M2 9 C 8 2, 14 16, 20 9 S 32 2, 38 9 S 50 16, 58 9"
        stroke={COLORS.ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PlayersIcon() {
  return (
    <Svg width={14} height={10} viewBox="0 0 14 10" fill="none">
      <Circle cx={4} cy={3} r={2.2} stroke={COLORS.ink} strokeWidth={1.6} />
      <Path d="M1 9 Q4 6 7 9" stroke={COLORS.ink} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Circle cx={10} cy={3} r={2.2} stroke={COLORS.ink} strokeWidth={1.6} />
      <Path d="M7 9 Q10 6 13 9" stroke={COLORS.ink} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function GearIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle cx={10} cy={10} r={3} stroke={COLORS.ink} strokeWidth={2} />
      <Path
        d="M10 1 v3 M10 16 v3 M1 10 h3 M16 10 h3 M3.5 3.5 l2 2 M14.5 14.5 l2 2 M16.5 3.5 l-2 2 M5.5 14.5 l-2 2"
        stroke={COLORS.ink}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ArrowRight() {
  return (
    <Svg width={12} height={10} viewBox="0 0 12 10" fill="none">
      <Path d="M1 5 H10 M6 1 L10 5 L6 9" stroke={COLORS.cream} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Game card (grid layout) ────────────────────────────────────

const GAME_ROTS = [-1.5, 1, -0.5, 1.5, -1, 0.8, -1.3, 0.6, -0.8, 1.2, -0.6];

function GameCard({ game, onPress, rot = 0 }: { game: Game; onPress: () => void; rot?: number }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, margin: 6 }}>
      <Sticker color={game.color} radius={20} shadowY={5} rotate={rot}>
        <View style={{ padding: 14 }}>
          {/* age badge + mins */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <View style={{ backgroundColor: COLORS.ink, borderRadius: RADIUS.pill, paddingHorizontal: 7, paddingVertical: 3 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.cream, letterSpacing: 0.8 }}>
                {game.age === '18+' ? '18+' : 'ALL'}
              </Text>
            </View>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink, opacity: 0.7 }}>
              {game.mins}m
            </Text>
          </View>

          {/* centered icon */}
          <View style={{ alignItems: 'center', marginVertical: 4 }}>
            <GameIcon gameId={game.id} size={64} color={COLORS.cream} />
          </View>

          {/* name */}
          <Text
            style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink, lineHeight: 16, letterSpacing: -0.3, marginTop: 6 }}
            numberOfLines={2}
          >
            {game.name}
          </Text>

          {/* players */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
            <PlayersIcon />
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink, opacity: 0.75 }}>
              {game.tag}
            </Text>
          </View>
        </View>
      </Sticker>
    </Pressable>
  );
}

// ── Screen ─────────────────────────────────────────────────────

const ACCENT_COLORS = [COLORS.mint, COLORS.yellow, COLORS.pink, COLORS.sky, COLORS.purple, COLORS.tomato];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, setCategory, addPlayer, removePlayer } = useApp();
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [newName, setNewName] = useState('');

  const filtered = state.category === 'all' ? GAMES : GAMES.filter((g) => g.cat === state.category);

  const categoryLabel =
    state.category === 'all'
      ? 'All games'
      : CATEGORIES.find((c) => c.id === state.category)?.label ?? '';

  function handleGamePress(game: Game) {
    if (game.id === 'spin_bottle') {
      router.push('/game/spin-bottle');
    } else {
      router.push(`/game/${game.id}`);
    }
  }

  function submitPlayer() {
    const name = newName.trim();
    if (name && !state.players.includes(name)) addPlayer(name);
    setNewName('');
    setAddingPlayer(false);
  }

  const now = new Date();
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: 22, paddingTop: insets.top + 12, marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink2, letterSpacing: 1.2 }}>
                {dayStr} · {timeStr}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 38,
                  color: COLORS.ink,
                  lineHeight: 38 * 0.95,
                  letterSpacing: -38 * 0.025,
                  marginTop: 4,
                }}
              >
                {"Let's get\nloud."}
              </Text>
            </View>

            {/* Settings button */}
            <View
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
                elevation: 3,
              }}
            >
              <GearIcon />
            </View>
          </View>
        </View>

        {/* ── Crew card ── */}
        <View style={{ marginHorizontal: 22, marginBottom: 18 }}>
          <Sticker color={COLORS.ink} radius={RADIUS.xl} shadowY={4}>
            <View style={{ padding: 14 }}>
              {/* crew header row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.yellow, letterSpacing: 1.4 }}>
                    TONIGHT'S CREW
                  </Text>
                  <View
                    style={{
                      backgroundColor: COLORS.pink,
                      borderRadius: RADIUS.pill,
                      paddingHorizontal: 7,
                      paddingVertical: 1,
                      borderWidth: 1.5,
                      borderColor: COLORS.cream,
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.display, fontSize: 11, color: COLORS.ink }}>
                      {state.players.length}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setAddingPlayer(true)}
                  style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: RADIUS.pill,
                    paddingHorizontal: 11,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 12, color: COLORS.ink }}>+ Add</Text>
                </Pressable>
              </View>

              {/* player chips */}
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
            </View>
          </Sticker>
        </View>

        {/* ── Category filter ── */}
        <View style={{ marginBottom: 16 }}>
          <CategoryPills active={state.category} onSelect={setCategory} />
        </View>

        {/* ── Featured card ── */}
        {state.category === 'all' && (
          <View style={{ marginHorizontal: 22, marginBottom: 20 }}>
            {/* section label */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Squiggle width={32} height={14} />
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1.4 }}>
                BUB'S PICK FOR TONIGHT
              </Text>
            </View>

            {/* card + Bub container */}
            <View>
              <Pressable onPress={() => router.push('/game/spin-bottle')}>
                <Sticker color={COLORS.pink} radius={26} shadowY={6}>
                  <View style={{ padding: 18, overflow: 'hidden' }}>
                    {/* burst decoration */}
                    <View style={{ position: 'absolute', right: -10, top: -10, opacity: 0.9 }}>
                      <Burst size={84} color={COLORS.yellow} />
                    </View>

                    {/* FEATURED badge */}
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: COLORS.ink,
                        borderRadius: RADIUS.pill,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.cream, letterSpacing: 1.2 }}>
                        ★ FEATURED
                      </Text>
                    </View>

                    {/* title + icon row */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: FONTS.display,
                            fontSize: 30,
                            color: COLORS.ink,
                            lineHeight: 30 * 0.92,
                            letterSpacing: -0.7,
                          }}
                        >
                          {"Spin the\nBottle"}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.ui,
                            fontSize: 13,
                            color: COLORS.ink,
                            opacity: 0.8,
                            marginTop: 10,
                            maxWidth: 170,
                            lineHeight: 18,
                          }}
                        >
                          Classic with a twist deck. Loud rooms only.
                        </Text>

                        {/* Play now button */}
                        <View style={{ marginTop: 12, alignSelf: 'flex-start' }}>
                          <StickerButton
                            color={COLORS.ink}
                            radius={RADIUS.pill}
                            shadowY={3}
                            onPress={() => router.push('/game/spin-bottle')}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10 }}>
                              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.cream }}>
                                Play now
                              </Text>
                              <ArrowRight />
                            </View>
                          </StickerButton>
                        </View>
                      </View>

                      {/* game icon */}
                      <View style={{ transform: [{ rotate: '-8deg' }] }}>
                        <GameIcon gameId="spin_bottle" size={96} color={COLORS.cream} />
                      </View>
                    </View>
                  </View>
                </Sticker>
              </Pressable>

              {/* Bub peeking at bottom-right */}
              <View
                style={{
                  position: 'absolute',
                  right: -8,
                  bottom: -16,
                  transform: [{ rotate: '8deg' }],
                  pointerEvents: 'none',
                }}
              >
                <Bub pose="point" size={70} color={COLORS.yellow} hat={COLORS.purple} />
              </View>
            </View>
          </View>
        )}

        {/* ── Section header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 22,
            marginBottom: 12,
            marginTop: state.category === 'all' ? 8 : 0,
          }}
        >
          <Text style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.ink, letterSpacing: -0.4 }}>
            {categoryLabel}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1 }}>
            {filtered.length} GAMES
          </Text>
        </View>

        {/* ── Game grid ── */}
        <View style={{ paddingHorizontal: 14, flexDirection: 'row', flexWrap: 'wrap' }}>
          {filtered.map((game, i) => (
            <View key={game.id} style={{ width: '50%' }}>
              <GameCard
                game={game}
                rot={GAME_ROTS[i % GAME_ROTS.length]}
                onPress={() => handleGamePress(game)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <TabBar />

      {/* ── Add player modal ── */}
      <Modal
        visible={addingPlayer}
        transparent
        animationType="slide"
        onRequestClose={() => setAddingPlayer(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(26,22,38,0.5)', justifyContent: 'flex-end' }}
          onPress={() => setAddingPlayer(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.cream,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 22,
              paddingBottom: insets.bottom + 20,
              borderWidth: 2.5,
              borderColor: COLORS.ink,
              borderBottomWidth: 0,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 99,
                backgroundColor: COLORS.ink,
                opacity: 0.2,
                alignSelf: 'center',
                marginBottom: 18,
              }}
            />
            <Text style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink, letterSpacing: -0.5 }}>
              Who's joining?
            </Text>
            <Text style={{ fontFamily: FONTS.ui, fontSize: 13, color: COLORS.ink2, marginTop: 4 }}>
              Add a player to tonight's crew.
            </Text>
            <TextInput
              autoFocus
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={submitPlayer}
              placeholder="Name"
              placeholderTextColor={COLORS.ink2}
              returnKeyType="done"
              style={{
                fontFamily: FONTS.ui,
                fontSize: 16,
                color: COLORS.ink,
                backgroundColor: '#fff',
                borderWidth: 2.5,
                borderColor: COLORS.ink,
                borderRadius: 14,
                padding: 14,
                marginTop: 16,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Pressable
                onPress={() => setAddingPlayer(false)}
                style={{
                  flex: 1,
                  borderWidth: 2.5,
                  borderColor: COLORS.ink,
                  borderRadius: RADIUS.pill,
                  padding: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.ink }}>Cancel</Text>
              </Pressable>
              <StickerButton
                color={COLORS.pink}
                radius={RADIUS.pill}
                shadowY={4}
                onPress={submitPlayer}
                style={{ flex: 1.4 }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.uiBold,
                    fontSize: 15,
                    color: COLORS.ink,
                    textAlign: 'center',
                    paddingVertical: 14,
                  }}
                >
                  Add to crew
                </Text>
              </StickerButton>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
