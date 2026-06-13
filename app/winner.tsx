import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Bub from '@/components/mascot/Bub';
import StickerButton from '@/components/ui/StickerButton';
import { useApp } from '@/store/useApp';
import { darken, lighten } from '@/theme/colors';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';
import { pickAvatar } from '@/utils/pickAvatar';
import { copyCard, saveCardToPhotos, shareCard } from '@/utils/shareCard';

const { width: SCREEN_W } = Dimensions.get('window');

// Confetti dots scattered behind the content — fixed positions so the
// captured image is deterministic.
const CONFETTI = [
  { top: 40, left: 24, color: COLORS.pink, size: 14 },
  { top: 90, left: 280, color: COLORS.mint, size: 18 },
  { top: 150, left: 60, color: COLORS.sky, size: 12 },
  { top: 70, left: 180, color: COLORS.purple, size: 10 },
  { top: 320, left: 30, color: COLORS.tomato, size: 16 },
  { top: 360, left: 270, color: COLORS.pink, size: 12 },
  { top: 470, left: 50, color: COLORS.mint, size: 14 },
  { top: 500, left: 240, color: COLORS.sky, size: 18 },
  { top: 540, left: 150, color: COLORS.purple, size: 10 },
];

type Status = 'idle' | 'saving' | 'sharing' | 'copying' | 'saved' | 'copied';

export default function WinnerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const params = useLocalSearchParams<{ name?: string; color?: string }>();

  const accent = params.color || COLORS.yellow;
  const [winner, setWinner] = useState<string>(params.name || '');
  const [photo, setPhoto] = useState<string | undefined>(
    params.name ? state.avatars[params.name] : undefined,
  );
  const [status, setStatus] = useState<Status>('idle');

  const cardRef = useRef<View>(null);

  function chooseWinner(name: string) {
    setWinner(name);
    setPhoto(state.avatars[name]);
  }

  async function changePhoto() {
    const uri = await pickAvatar();
    if (uri) setPhoto(uri);
  }

  async function onSave() {
    setStatus('saving');
    try {
      const ok = await saveCardToPhotos(cardRef);
      setStatus(ok ? 'saved' : 'idle');
      if (ok) setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('idle');
    }
  }

  async function onShare() {
    setStatus('sharing');
    try {
      await shareCard(cardRef);
    } finally {
      setStatus('idle');
    }
  }

  async function onCopy() {
    setStatus('copying');
    try {
      const ok = await copyCard(cardRef);
      setStatus(ok ? 'copied' : 'idle');
      if (ok) setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('idle');
    }
  }

  const today = new Date()
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();

  const cardWidth = SCREEN_W - 40;
  const cardHeight = (cardWidth * 16) / 9;
  const busy = status === 'saving' || status === 'sharing' || status === 'copying';

  // ── Winner picker (shown until a winner is chosen) ──
  if (!winner) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.cream2 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ position: 'absolute', top: insets.top + 12, left: 16, zIndex: 10, padding: 8 }}
        >
          <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}>← Back</Text>
        </Pressable>

        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 64, paddingHorizontal: 24, paddingBottom: 48 }}>
          <Bub pose="cheer" size={120} color={COLORS.yellow} />
          <Text
            style={{
              fontFamily: FONTS.display,
              fontSize: 40,
              color: COLORS.ink,
              lineHeight: 40 * 0.98,
              letterSpacing: -1,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Who won? 👑
          </Text>
          <Text style={{ fontFamily: FONTS.ui, fontSize: 15, color: COLORS.ink2, marginBottom: 28 }}>
            Crown tonight's champion and make a story to remember it.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {state.players.map((name) => (
              <Pressable
                key={name}
                onPress={() => chooseWinner(name)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: RADIUS.pill,
                  borderWidth: 2.5,
                  borderColor: COLORS.ink,
                  backgroundColor: COLORS.cream,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    overflow: 'hidden',
                    backgroundColor: COLORS.yellow,
                    borderWidth: 2,
                    borderColor: COLORS.ink,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {state.avatars[name] ? (
                    <Image source={{ uri: state.avatars[name] }} style={{ width: 34, height: 34 }} resizeMode="cover" />
                  ) : (
                    <Text style={{ fontFamily: FONTS.display, fontSize: 15, color: COLORS.ink }}>
                      {name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}>{name}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Story card + actions ──
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 12, left: 16, zIndex: 10, padding: 8 }}
      >
        <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.cream }}>← Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: 40, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Capturable story card (full-bleed 9:16) ── */}
        <View
          ref={cardRef}
          collapsable={false}
          style={{ width: cardWidth, height: cardHeight, borderRadius: RADIUS.xl, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={[lighten(accent, 0.4), accent, darken(accent, 0.25)]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={{ flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32 }}
          >
            {/* Confetti */}
            {CONFETTI.map((c, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  top: c.top,
                  left: c.left,
                  width: c.size,
                  height: c.size,
                  borderRadius: c.size / 2,
                  backgroundColor: c.color,
                  borderWidth: 1.5,
                  borderColor: COLORS.ink,
                  transform: [{ rotate: `${i * 25}deg` }],
                }}
              />
            ))}

            {/* Wordmark */}
            <View style={{ alignSelf: 'stretch', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.ink, letterSpacing: 1 }}>
                PASS
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.ink, letterSpacing: 2, opacity: 0.7 }}>
                GAME NIGHT · {today}
              </Text>
            </View>

            {/* Crown + label */}
            <Text style={{ fontSize: 44, marginTop: 28 }}>👑</Text>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 12,
                color: COLORS.ink,
                letterSpacing: 3,
                marginTop: 4,
              }}
            >
              TONIGHT'S CHAMPION
            </Text>

            {/* Photo or Bub */}
            <View
              style={{
                marginTop: 24,
                width: cardWidth * 0.52,
                height: cardWidth * 0.52,
                borderRadius: RADIUS.xl,
                borderWidth: 3,
                borderColor: COLORS.ink,
                backgroundColor: COLORS.cream,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ rotate: '-3deg' }],
              }}
            >
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <Bub pose="cheer" size={cardWidth * 0.42} color={COLORS.yellow} />
              )}
            </View>

            {/* Winner name */}
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 46,
                color: COLORS.ink,
                textAlign: 'center',
                marginTop: 28,
                lineHeight: 46,
              }}
              numberOfLines={2}
            >
              {winner}
            </Text>

            {/* Footer */}
            <View style={{ marginTop: 'auto', alignItems: 'center' }}>
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.ink, opacity: 0.85 }}>
                Crowned by Bub 🎉
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Photo controls ── */}
        <Pressable onPress={changePhoto} style={{ paddingVertical: 16 }}>
          <Text style={{ fontFamily: FONTS.uiBold, fontSize: 15, color: COLORS.cream }}>
            📷 {photo ? 'Change photo' : 'Capture the winning moment'}
          </Text>
        </Pressable>

        {/* ── Actions ── */}
        <View style={{ width: cardWidth, gap: 12 }}>
          <StickerButton color={COLORS.yellow} radius={RADIUS.pill} onPress={onSave}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 }}>
              {status === 'saving' && <ActivityIndicator color={COLORS.ink} />}
              <Text style={{ fontFamily: FONTS.uiBold, fontSize: 17, color: COLORS.ink }}>
                {status === 'saved' ? 'Saved to Photos ✓' : 'Save to Photos'}
              </Text>
            </View>
          </StickerButton>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <StickerButton color={COLORS.mint} radius={RADIUS.pill} onPress={onShare} style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 }}>
                {status === 'sharing' && <ActivityIndicator color={COLORS.ink} />}
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}>Share</Text>
              </View>
            </StickerButton>

            <StickerButton color={COLORS.sky} radius={RADIUS.pill} onPress={onCopy} style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 }}>
                {status === 'copying' && <ActivityIndicator color={COLORS.ink} />}
                <Text style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}>
                  {status === 'copied' ? 'Copied ✓' : 'Copy'}
                </Text>
              </View>
            </StickerButton>
          </View>

          <Pressable onPress={() => setWinner('')} disabled={busy} style={{ paddingVertical: 14 }}>
            <Text style={{ fontFamily: FONTS.uiBold, fontSize: 14, color: COLORS.ink2, textAlign: 'center' }}>
              Pick a different winner
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
