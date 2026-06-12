import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Bub from "@/components/mascot/Bub";
import Sticker from "@/components/ui/Sticker";
import { GAMES } from "@/data/games";
import { COLORS, FONTS, RADIUS } from "@/theme/tokens";

export default function GameComingSoon() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = GAMES.find((g) => g.id === id);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: game?.color ?? COLORS.cream2,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 16,
          padding: 8,
        }}
      >
        <Text
          style={{ fontFamily: FONTS.uiBold, fontSize: 16, color: COLORS.ink }}
        >
          ← Back
        </Text>
      </Pressable>

      <Bub pose="wave" size={140} color={COLORS.yellow} />

      <Sticker
        color={COLORS.cream}
        radius={RADIUS.xl}
        shadowY={5}
        style={{ marginTop: 32, width: "100%" }}
      >
        <View style={{ padding: 24, alignItems: "center" }}>
          <View
            style={{
              backgroundColor: COLORS.ink,
              borderRadius: RADIUS.pill,
              paddingHorizontal: 14,
              paddingVertical: 6,
              marginBottom: 16,
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
              COMING SOON
            </Text>
          </View>
          <Text
            style={{
              fontFamily: FONTS.display,
              fontSize: 32,
              color: COLORS.ink,
              textAlign: "center",
              lineHeight: 32,
              marginBottom: 12,
            }}
          >
            {game?.name ?? "Game"}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.ui,
              fontSize: 15,
              color: COLORS.inkSoft,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Bub is hard at work building this one. Check back soon!
          </Text>
        </View>
      </Sticker>
    </View>
  );
}
