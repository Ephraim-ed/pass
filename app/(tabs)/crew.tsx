import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import TabBar from '@/components/ui/TabBar';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

const ACCENT_COLORS = [
  COLORS.mint, COLORS.yellow, COLORS.pink, COLORS.sky, COLORS.purple, COLORS.tomato,
];

function PlayerAvatar({ name, color }: { name: string; color: string }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.5,
        borderColor: COLORS.ink,
      }}
    >
      <Text style={{ fontFamily: FONTS.display, fontSize: 16, color: COLORS.ink }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export default function CrewScreen() {
  const insets = useSafeAreaInsets();
  const { state, addPlayer, removePlayer } = useApp();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    const name = newName.trim();
    if (name && !state.players.includes(name)) {
      addPlayer(name);
    }
    setNewName('');
    setAdding(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: insets.top + 16,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.ink2, letterSpacing: 1.2 }}>
            TONIGHT'S CREW
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
            The Crew
          </Text>
        </View>

        {/* Player list */}
        <Sticker color={COLORS.cream2} radius={RADIUS.xl} shadowY={4}>
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                color: COLORS.ink2,
                letterSpacing: 1.5,
                marginBottom: 8,
              }}
            >
              {state.players.length} PLAYERS
            </Text>

            {state.players.map((name, i) => (
              <View
                key={name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: i < state.players.length - 1 ? 1.5 : 0,
                  borderBottomColor: COLORS.cream,
                  gap: 12,
                }}
              >
                <PlayerAvatar name={name} color={ACCENT_COLORS[i % ACCENT_COLORS.length]} />
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 17, color: COLORS.ink, flex: 1 }}>
                  {name}
                </Text>
                {state.players.length > 2 && (
                  <Pressable onPress={() => removePlayer(name)} hitSlop={12}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: COLORS.cream,
                        borderWidth: 2,
                        borderColor: COLORS.ink,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink, lineHeight: 18 }}>×</Text>
                    </View>
                  </Pressable>
                )}
              </View>
            ))}

            {adding && (
              <TextInput
                autoFocus
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={handleAdd}
                onBlur={() => setAdding(false)}
                placeholder="Add player name..."
                placeholderTextColor={COLORS.ink2}
                returnKeyType="done"
                style={{
                  fontFamily: FONTS.ui,
                  fontSize: 15,
                  color: COLORS.ink,
                  paddingVertical: 12,
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.ink,
                  marginTop: 8,
                }}
              />
            )}
          </View>
        </Sticker>

        {/* Add player button */}
        <StickerButton
          color={COLORS.ink}
          radius={RADIUS.pill}
          onPress={() => setAdding(true)}
          style={{ marginTop: 20 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18 }}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Circle cx={8} cy={8} r={7} stroke={COLORS.cream} strokeWidth={1.8} />
              <Path d="M8 4 V12 M4 8 H12" stroke={COLORS.cream} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.cream }}>
              Add Player
            </Text>
          </View>
        </StickerButton>

        {/* Min players note */}
        {state.players.length <= 2 && (
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.ink2,
              textAlign: 'center',
              marginTop: 12,
              letterSpacing: 0.5,
            }}
          >
            Need at least 3 players to remove one.
          </Text>
        )}
      </ScrollView>

      <TabBar />
    </View>
  );
}
