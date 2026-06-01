import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlayerChip from '@/components/shared/PlayerChip';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import TabBar from '@/components/ui/TabBar';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

const ACCENT_COLORS = [
  COLORS.mint, COLORS.yellow, COLORS.pink, COLORS.sky, COLORS.purple, COLORS.tomato,
];

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
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 120 }}>
        <Text
          style={{
            fontFamily: FONTS.display,
            fontSize: 38,
            color: COLORS.ink,
            lineHeight: 38 * 0.98,
            marginBottom: 24,
          }}
        >
          The Crew
        </Text>

        <Sticker color={COLORS.cream2} radius={RADIUS.xl} shadowY={4}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1.5, marginBottom: 16 }}>
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
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: COLORS.ink,
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.ink }}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink, flex: 1 }}>{name}</Text>
                {state.players.length > 2 && (
                  <Pressable onPress={() => removePlayer(name)} hitSlop={12}>
                    <Text style={{ fontFamily: FONTS.uiBold, fontSize: 20, color: COLORS.ink2 }}>×</Text>
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

        <StickerButton
          color={COLORS.mint}
          radius={RADIUS.pill}
          onPress={() => setAdding(true)}
          style={{ marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: FONTS.uiBold,
              fontSize: 16,
              color: COLORS.ink,
              textAlign: 'center',
              paddingVertical: 16,
            }}
          >
            + Add Player
          </Text>
        </StickerButton>
      </ScrollView>

      <TabBar />
    </View>
  );
}
