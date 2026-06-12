import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Dots from "@/components/ui/Dots";
import StickerButton from "@/components/ui/StickerButton";
import Bub from "@/components/mascot/Bub";
import { useApp } from "@/store/useApp";
import { COLORS, FONTS, RADIUS } from "@/theme/tokens";
import { promptAndPickAvatar } from "@/utils/pickAvatar";

// ── Intro slide definitions ────────────────────────────────────

const SLIDES = [
  {
    badge: "MEET YOUR HOST",
    headline: "Bub runs\nthe show.",
    body: "Your MC for 11 party games. One phone, no accounts, all chaos.",
    pose: "wave" as const,
    color: COLORS.yellow,
    hat: COLORS.pink,
    bg: COLORS.cream2,
  },
  {
    badge: "HOW IT WORKS",
    headline: "Tap, play,\npass it on.",
    body: "No sign-ups. No downloads. Just tap a game and hand the phone around.",
    pose: "point" as const,
    color: COLORS.mint,
    hat: COLORS.tomato,
    bg: "#E9D7FF",
  },
  {
    badge: "OFFLINE",
    headline: "Works on\nairplane mode.",
    body: "Zero signal required. Everything lives right here on the device.",
    pose: "cheer" as const,
    color: COLORS.sky,
    hat: COLORS.yellow,
    bg: "#D4F5E9",
  },
];

// crew step is index 3
const TOTAL_STEPS = SLIDES.length + 1;
const CREW_STEP = SLIDES.length;
const CREW_BG = "#FFF0C4";

// ── Accent colours for player chips ───────────────────────────

const CHIP_COLORS = [
  COLORS.mint,
  COLORS.pink,
  COLORS.sky,
  COLORS.purple,
  COLORS.tomato,
  COLORS.yellow,
];

function PlayerChipOnboarding({
  name,
  color,
  avatar,
  onRemove,
  onAvatarChange,
}: {
  name: string;
  color: string;
  avatar?: string;
  onRemove: () => void;
  onAvatarChange: (uri: string) => void;
}) {
  async function handleAvatarPress() {
    const uri = await promptAndPickAvatar(name);
    if (uri) onAvatarChange(uri);
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color,
        borderWidth: 2,
        borderColor: COLORS.ink,
        borderRadius: RADIUS.pill,
        paddingLeft: 4,
        paddingRight: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
        gap: 6,
      }}
    >
      {/* Tappable avatar */}
      <Pressable onPress={handleAvatarPress}>
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: COLORS.ink,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: 26, height: 26 }}
              resizeMode="cover"
            />
          ) : (
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 12,
                color: COLORS.cream,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
      </Pressable>
      <Text
        style={{ fontFamily: FONTS.uiBold, fontSize: 13, color: COLORS.ink }}
      >
        {name}
      </Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <Text
          style={{
            fontFamily: FONTS.uiBold,
            fontSize: 15,
            color: COLORS.ink,
            lineHeight: 17,
          }}
        >
          ×
        </Text>
      </Pressable>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [nameInput, setNameInput] = useState("");
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { update } = useApp();

  const stepSV = useSharedValue(0);

  const goNext = useCallback(() => {
    setStep((s) => {
      const next = Math.min(s + 1, TOTAL_STEPS - 1);
      stepSV.value = next;
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setStep((s) => {
      const prev = Math.max(s - 1, 0);
      stepSV.value = prev;
      return prev;
    });
  }, []);

  const gesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50 && stepSV.value < TOTAL_STEPS - 1) {
      runOnJS(goNext)();
    } else if (e.translationX > 50 && stepSV.value > 0) {
      runOnJS(goPrev)();
    }
  });

  async function addPlayer() {
    const name = nameInput.trim();
    if (!name || players.includes(name)) {
      setNameInput("");
      return;
    }
    setPlayers((prev) => [...prev, name]);
    setNameInput("");
    const uri = await promptAndPickAvatar(name);
    if (uri) setPlayerAvatar(name, uri);
    inputRef.current?.focus();
  }

  function removePlayer(name: string) {
    setPlayers((prev) => prev.filter((p) => p !== name));
    setAvatars((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }

  function setPlayerAvatar(name: string, uri: string) {
    setAvatars((prev) => ({ ...prev, [name]: uri }));
  }

  function finish() {
    update({ players, avatars, hasOnboarded: true });
    router.replace("/(tabs)/home");
  }

  function skipIntro() {
    stepSV.value = SLIDES.length - 1;
    setStep(CREW_STEP);
  }

  const isCrewStep = step === CREW_STEP;
  const isLast = step === TOTAL_STEPS - 1;
  const canFinish = !isCrewStep || players.length >= 2;

  const bg = isCrewStep ? CREW_BG : SLIDES[step]?.bg;

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Skip — only on intro slides */}
        {!isCrewStep && (
          <Pressable
            onPress={skipIntro}
            style={{
              position: "absolute",
              top: insets.top + 14,
              right: 24,
              zIndex: 10,
              padding: 8,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 12,
                color: COLORS.ink2,
                letterSpacing: 1,
              }}
            >
              SKIP
            </Text>
          </Pressable>
        )}

        {/* ── Intro slides ── */}
        {!isCrewStep &&
          (() => {
            const s = SLIDES[step];
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 32,
                }}
              >
                <View style={{ marginBottom: 32 }}>
                  <Bub pose={s.pose} size={160} color={s.color} />
                </View>

                <View
                  style={{
                    backgroundColor: COLORS.ink,
                    borderRadius: RADIUS.pill,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 10,
                      color: COLORS.cream,
                      letterSpacing: 1.5,
                    }}
                  >
                    {s.badge}
                  </Text>
                </View>

                <Text
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 42,
                    color: COLORS.ink,
                    lineHeight: 42 * 0.98,
                    letterSpacing: -42 * 0.025,
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  {s.headline}
                </Text>

                <Text
                  style={{
                    fontFamily: FONTS.ui,
                    fontSize: 16,
                    color: COLORS.inkSoft,
                    textAlign: "center",
                    lineHeight: 24,
                    marginBottom: 48,
                  }}
                >
                  {s.body}
                </Text>

                <Dots total={TOTAL_STEPS} active={step} />
              </View>
            );
          })()}

        {/* ── Crew step ── */}
        {isCrewStep && (
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 24,
              paddingHorizontal: 28,
              paddingBottom: 32,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Bub + headline */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <Bub pose="cheer" size={100} color={COLORS.pink} />
              <View style={{ flex: 1, paddingBottom: 8 }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: COLORS.ink,
                    borderRadius: RADIUS.pill,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 10,
                      color: COLORS.cream,
                      letterSpacing: 1.5,
                    }}
                  >
                    THE CREW
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 38,
                    color: COLORS.ink,
                    lineHeight: 38 * 0.95,
                    letterSpacing: -38 * 0.025,
                  }}
                >
                  {"Who's\nplaying?"}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontFamily: FONTS.ui,
                fontSize: 15,
                color: COLORS.inkSoft,
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              Add at least 2 players to get started. You can change the crew
              anytime.
            </Text>

            {/* Input row */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
              <TextInput
                ref={inputRef}
                value={nameInput}
                onChangeText={setNameInput}
                onSubmitEditing={addPlayer}
                placeholder="Player name…"
                placeholderTextColor={COLORS.ink2}
                returnKeyType="done"
                blurOnSubmit={false}
                style={{
                  flex: 1,
                  fontFamily: FONTS.ui,
                  fontSize: 16,
                  color: COLORS.ink,
                  backgroundColor: "#fff",
                  borderWidth: 2.5,
                  borderColor: COLORS.ink,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  shadowColor: COLORS.ink,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                }}
              />
              <Pressable
                onPress={addPlayer}
                style={{
                  width: 50,
                  borderRadius: 14,
                  backgroundColor: COLORS.ink,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: COLORS.ink,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                }}
              >
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path
                    d="M10 4 V16 M4 10 H16"
                    stroke={COLORS.cream}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </Svg>
              </Pressable>
            </View>

            {/* Player chips */}
            {players.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {players.map((name, i) => (
                  <PlayerChipOnboarding
                    key={name}
                    name={name}
                    color={CHIP_COLORS[i % CHIP_COLORS.length]}
                    avatar={avatars[name]}
                    onRemove={() => removePlayer(name)}
                    onAvatarChange={(uri) => setPlayerAvatar(name, uri)}
                  />
                ))}
              </View>
            )}

            {players.length === 0 && (
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: COLORS.ink2,
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                No players yet — add at least 2.
              </Text>
            )}

            {players.length === 1 && (
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: COLORS.ink2,
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                Add one more to continue.
              </Text>
            )}

            {/* Dots */}
            <View
              style={{
                marginTop: 24,
                marginBottom: 8,
                alignItems: "flex-start",
              }}
            >
              <Dots total={TOTAL_STEPS} active={step} />
            </View>
          </ScrollView>
        )}

        {/* ── Bottom button ── */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 24,
            paddingTop: 12,
          }}
        >
          <StickerButton
            color={canFinish ? COLORS.ink : COLORS.ink2}
            radius={RADIUS.pill}
            onPress={isLast ? (canFinish ? finish : undefined) : goNext}
            style={{ overflow: "visible" }}
          >
            <Text
              style={{
                fontFamily: FONTS.uiBold,
                fontSize: 18,
                color: COLORS.cream,
                textAlign: "center",
                paddingVertical: 18,
                opacity: isLast && !canFinish ? 0.5 : 1,
              }}
            >
              {isLast ? "Let's go!" : "Next"}
            </Text>
          </StickerButton>
        </View>
      </View>
    </GestureDetector>
  );
}
