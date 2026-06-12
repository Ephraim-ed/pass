// ── Phase 1: Game Rules ──
//
// First screen the players see. Shows the 6 core rules of the game
// inside a sticker card, with the Bub mascot and a Start button.
// Back arrow returns to Home.

import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Sticker from "@/components/ui/Sticker";
import StickerButton from "@/components/ui/StickerButton";
import Bub from "@/components/mascot/Bub";
import { COLORS, FONTS, RADIUS } from "@/theme/tokens";

// -- Back arrow (same pattern as spin-bottle) --------------------

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.backBtn} onPress={onPress}>
      <Svg width={16} height={14} viewBox="0 0 16 14" fill="none">
        <Path
          d="M15 7 H1 M7 1 L1 7 L7 13"
          stroke={COLORS.ink}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

// -- Rule row (number + text) ------------------------------------

function RuleRow({ num, children }: { num: number; children: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.ruleNum}>
        <Text style={styles.ruleNumText}>{num}</Text>
      </View>
      <Text style={styles.ruleText}>{children}</Text>
    </View>
  );
}

// -- Main component -----------------------------------------------

interface PhaseRulesProps {
  onBack: () => void;
  onStart: () => void;
}

export default function PhaseRules({ onBack, onStart }: PhaseRulesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.backRow}>
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>CREATIVE · ALL AGES</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{"Secret\nNumber."}</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Can your team crack the order?{"\n"}Rank yourselves — lowest to
          highest.
        </Text>

        {/* Rules sticker card */}
        <Sticker color={COLORS.mint} radius={RADIUS.xl} shadowY={5} rotate={0}>
          <View style={styles.rulesCard}>
            <Text style={styles.rulesHeading}>How to play</Text>
            <RuleRow num={1}>
              Pick a category for the group to play with.
            </RuleRow>
            <RuleRow num={2}>
              Everyone gets a secret number from 1 to 100.
            </RuleRow>
            <RuleRow num={3}>
              Think of a subject in the category that matches your number's
              value.
            </RuleRow>
            <RuleRow num={4}>
              Describe your subject — without revealing your number.
            </RuleRow>
            <RuleRow num={5}>
              Work as a team. Arrange everyone from lowest to highest.
            </RuleRow>
            <RuleRow num={6}>
              Reveal the numbers and see how accurate you were.
            </RuleRow>
          </View>
        </Sticker>

        {/* Bub mascot */}
        <View style={styles.bubWrap}>
          <Bub pose="dance" size={90} color={COLORS.yellow} />
        </View>
      </ScrollView>

      {/* Start button — pinned to bottom */}
      <View style={styles.startWrap}>
        <StickerButton
          color={COLORS.mint}
          radius={RADIUS.pill}
          shadowY={5}
          onPress={onStart}
        >
          <View style={styles.startInner}>
            <Text style={styles.startText}>Start</Text>
            <Svg width={18} height={14} viewBox="0 0 18 14" fill="none">
              <Path
                d="M1 7 H16 M10 1 L16 7 L10 13"
                stroke={COLORS.ink}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </StickerButton>
      </View>
    </View>
  );
}

// -- Styles -------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  backRow: {
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: COLORS.cream,
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 120,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 20,
  },
  badgeText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.cream,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 52,
    color: COLORS.ink,
    lineHeight: 56,
    letterSpacing: -1.5,
    marginTop: 12,
  },
  tagline: {
    fontFamily: FONTS.ui,
    fontSize: 16,
    color: COLORS.inkSoft,
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 24,
  },
  rulesCard: {
    padding: 20,
    gap: 14,
  },
  rulesHeading: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.ink,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  ruleNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ruleNumText: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: COLORS.cream,
    lineHeight: 15,
  },
  ruleText: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: 14,
    color: COLORS.ink,
    lineHeight: 20,
  },
  bubWrap: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  startWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  startInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
  },
  startText: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.ink,
  },
});
