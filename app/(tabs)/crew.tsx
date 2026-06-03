import { useState } from 'react';
import { ActionSheetIOS, Alert, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import TabBar from '@/components/ui/TabBar';
import { useApp } from '@/store/useApp';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';
import { pickAvatar, promptAndPickAvatar } from '@/utils/pickAvatar';

const ACCENT_COLORS = [
  COLORS.mint, COLORS.yellow, COLORS.pink, COLORS.sky, COLORS.purple, COLORS.tomato,
];

function PlayerRow({
  name,
  accent,
  avatar,
  removable,
  onRemove,
  onAvatarChange,
}: {
  name: string;
  accent: string;
  avatar?: string;
  removable: boolean;
  onRemove: () => void;
  onAvatarChange: (uri: string | null) => void;
}) {
  async function handleAvatarPress() {
    if (avatar) {
      // Already has photo — offer replace or remove
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          { options: ['Cancel', 'Replace Photo', 'Remove Photo'], cancelButtonIndex: 0, destructiveButtonIndex: 2 },
          async (i) => {
            if (i === 1) {
              const uri = await pickAvatar();
              if (uri) onAvatarChange(uri);
            } else if (i === 2) {
              onAvatarChange(null);
            }
          },
        );
      } else {
        Alert.alert('Avatar', '', [
          { text: 'Replace Photo', onPress: async () => { const uri = await pickAvatar(); if (uri) onAvatarChange(uri); } },
          { text: 'Remove Photo', style: 'destructive', onPress: () => onAvatarChange(null) },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    } else {
      const uri = await pickAvatar();
      if (uri) onAvatarChange(uri);
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
      }}
    >
      {/* Tappable avatar */}
      <Pressable onPress={handleAvatarPress}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: accent,
            borderWidth: 2.5,
            borderColor: COLORS.ink,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={{ width: 44, height: 44 }} resizeMode="cover" />
          ) : (
            <Text style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.ink }}>
              {name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        {/* Camera badge */}
        <View
          style={{
            position: 'absolute',
            right: -3,
            bottom: -3,
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: COLORS.ink,
            borderWidth: 1.5,
            borderColor: COLORS.cream2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg width={10} height={9} viewBox="0 0 10 9" fill="none">
            <Path d="M3.5 1 L1 2.5 L1 7.5 L9 7.5 L9 2.5 L6.5 1 Z" stroke={COLORS.cream} strokeWidth="0.8" fill={COLORS.cream} opacity={0.0} />
            <Circle cx="5" cy="5" r="1.6" stroke={COLORS.cream} strokeWidth="0.9" />
            <Path d="M1 3 L1 7.5 Q1 8 1.5 8 L8.5 8 Q9 8 9 7.5 L9 3 Q9 2.5 8.5 2.5 L6.8 2.5 L6 1 L4 1 L3.2 2.5 L1.5 2.5 Q1 2.5 1 3 Z" fill={COLORS.cream} stroke="none" />
            <Circle cx="5" cy="4.8" r="1.4" fill={COLORS.ink} />
          </Svg>
        </View>
      </Pressable>

      <Text style={{ fontFamily: FONTS.uiBold, fontSize: 17, color: COLORS.ink, flex: 1 }}>
        {name}
      </Text>

      {removable && (
        <Pressable onPress={onRemove} hitSlop={12}>
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
  );
}

export default function CrewScreen() {
  const insets = useSafeAreaInsets();
  const { state, addPlayer, removePlayer, setAvatar, removeAvatar } = useApp();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    const name = newName.trim();
    if (!name || state.players.includes(name)) { setNewName(''); setAdding(false); return; }
    addPlayer(name);
    setNewName('');
    const uri = await promptAndPickAvatar(name);
    if (uri) setAvatar(name, uri);
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
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, letterSpacing: 1.5, marginBottom: 8 }}>
              {state.players.length} PLAYERS
            </Text>

            {state.players.map((name, i) => (
              <View
                key={name}
                style={{
                  borderBottomWidth: i < state.players.length - 1 ? 1.5 : 0,
                  borderBottomColor: COLORS.cream,
                }}
              >
                <PlayerRow
                  name={name}
                  accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                  avatar={state.avatars?.[name]}
                  removable={state.players.length > 2}
                  onRemove={() => removePlayer(name)}
                  onAvatarChange={(uri) => uri ? setAvatar(name, uri) : removeAvatar(name)}
                />
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
        <StickerButton color={COLORS.ink} radius={RADIUS.pill} onPress={() => setAdding(true)} style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18 }}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Circle cx={8} cy={8} r={7} stroke={COLORS.cream} strokeWidth={1.8} />
              <Path d="M8 4 V12 M4 8 H12" stroke={COLORS.cream} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.cream }}>Add Player</Text>
          </View>
        </StickerButton>

        {state.players.length <= 2 && (
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink2, textAlign: 'center', marginTop: 12, letterSpacing: 0.5 }}>
            Need at least 3 players to remove one.
          </Text>
        )}
      </ScrollView>

      <TabBar />
    </View>
  );
}
