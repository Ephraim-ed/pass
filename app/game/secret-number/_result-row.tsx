// ── Result Player Row (sub-component of PhaseResults) ──
//
// A card representing one position in the sorting order.
//
// BEFORE REVEAL:  shows the team's pick (name + avatar) + a "Reveal" button.
//                 The answer is hidden — creates suspense.
//
// AFTER REVEAL:   the card expands. Shows:
//                 - Your player's secret number
//                 - Who SHOULD have been in this spot (answer key)
//                 - CORRECT or WRONG text badge
//                 Card background turns mint (correct) or yellow (wrong).
//
// Avatars: shows player photo if available, otherwise initial letter.

import { useMemo } from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import StickerButton from "@/components/ui/StickerButton";
import type { PlayerAssignment } from "@/features/secret-number/types";
import { COLORS, FONTS, RADIUS } from "@/theme/tokens";

interface ResultPlayerRowProps {
  position: number;
  submitted: PlayerAssignment;
  correct: PlayerAssignment;
  isRevealed: boolean;
  avatarUri?: string;
  correctAvatarUri?: string;
  onReveal: () => void;
}

// -- Eye icon for reveal button -----------------------------------

function EyeIcon() {
  return (
    <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
      <Path
        d="M1 6 Q4 1 8 1 Q12 1 15 6 Q12 11 8 11 Q4 11 1 6 Z"
        stroke={"white"}
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M6 6 A2 2 0 1 0 10 6 A2 2 0 1 0 6 6"
        stroke={"white"}
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
}

// -- Main component -----------------------------------------------

export default function ResultPlayerRow({
  position,
  submitted,
  correct,
  isRevealed,
  avatarUri,
  correctAvatarUri,
  onReveal,
}: ResultPlayerRowProps) {
  const isCorrect = submitted.name === correct.name;

  const messages = useMemo(() => {
    const correctMessages = [
      "Nailed it.",
      "Right on the money.",
      "Spot on.",
      "Exactly where they belong.",
      "Perfect call.",
      "Dead on.",
      "Couldn't have placed it better.",
    ];
    const wrongMessages = [
      "Not quite.",
      "Close, but not here.",
      "Wrong spot.",
      "Misplaced.",
      "Should've been elsewhere.",
      "Off the mark.",
      "This one slipped.",
    ];
    const pick = (pool: string[]) =>
      pool[Math.floor(Math.random() * pool.length)];
    return {
      correct: pick(correctMessages),
      wrong: pick(wrongMessages),
    };
  }, []);

  return (
    <View
      style={[
        styles.card,
        isRevealed && (isCorrect ? styles.cardCorrect : styles.cardWrong),
      ]}
    >
      {/* ── Top section: position + your pick ── */}
      <View style={styles.topRow}>
        {/* Position */}
        <View style={styles.posBadge}>
          <Text style={styles.posText}>{position}</Text>
        </View>

        {/* Your pick: avatar + name */}
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.initial}>
              {submitted.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {submitted.name}
        </Text>

        <View style={{ flex: 1 }} />

        {/* Secret number (only after reveal) */}
        {isRevealed && (
          <View style={styles.secretBadge}>
            <Text style={styles.secretText}>#{submitted.number}</Text>
          </View>
        )}

        {/* Reveal button or result text */}
        {isRevealed ? (
          <View
            style={[
              styles.resultBadge,
              isCorrect ? styles.badgeCorrect : styles.badgeWrong,
            ]}
          >
            <Text style={styles.resultText}>
              {isCorrect ? "Correct" : "Wrong"}
            </Text>
          </View>
        ) : (
          <StickerButton
            color={COLORS.ink}
            radius={14}
            shadowY={3}
            onPress={onReveal}
          >
            <View style={styles.revealBtn}>
              <EyeIcon />
              <Text style={styles.revealBtnText}>Reveal</Text>
            </View>
          </StickerButton>
        )}
      </View>

      {/* ── Bottom section: answer key (only after reveal) ── */}
      {isRevealed && (
        <View style={styles.answerSection}>
          <View style={styles.divider} />

          {isCorrect ? (
            <Text style={styles.answerMessage}>✓ {messages.correct}</Text>
          ) : (
            <>
              <Text style={styles.answerMessage}>{messages.wrong}</Text>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Should be:</Text>
                <View style={styles.answerAvatar}>
                  {correctAvatarUri ? (
                    <Image
                      source={{ uri: correctAvatarUri }}
                      style={styles.answerAvatarImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.answerInitial}>
                      {correct.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text style={styles.answerName}>{correct.name}</Text>
                <Text style={styles.answerNum}>#{correct.number}</Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* ── Unrevealed hint (subtle) ── */}
      {!isRevealed && (
        <Text style={styles.hint}>
          Tap reveal to see if this is the right spot.
        </Text>
      )}
    </View>
  );
}

// -- Styles -------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    backgroundColor: COLORS.cream2,
    padding: 16,
    marginBottom: 10,
  },
  cardCorrect: {
    backgroundColor: COLORS.mint,
  },
  cardWrong: {
    backgroundColor: COLORS.yellow,
  },

  // -- Top row --
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  posBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  posText: {
    fontFamily: FONTS.display,
    fontSize: 14,
    color: COLORS.cream,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  initial: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: COLORS.cream,
  },
  name: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.ink,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  secretBadge: {
    backgroundColor: COLORS.cream,
    borderWidth: 2,
    borderColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  secretText: {
    fontFamily: FONTS.mono,
    fontSize: 15,
    color: COLORS.ink,
    fontWeight: "700",
  },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  revealBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.cream,
  },
  resultBadge: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: COLORS.ink,
  },
  badgeCorrect: {
    backgroundColor: COLORS.cream,
  },
  badgeWrong: {
    backgroundColor: COLORS.cream,
  },
  resultText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: COLORS.ink,
    letterSpacing: 0.5,
  },

  // -- Answer section (below the fold) --
  answerSection: {
    marginTop: 12,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.ink,
    opacity: 0.2,
    marginBottom: 12,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  answerLabel: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.ink2,
    letterSpacing: 0.8,
  },
  answerMessage: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.ink,
    marginBottom: 8,
  },
  answerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: 4,
  },
  answerAvatarImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  answerInitial: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.cream,
  },
  answerName: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  answerNum: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.ink,
    fontWeight: "700",
    marginLeft: "auto",
  },

  // -- Unrevealed hint --
  hint: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.ink2,
    marginTop: 8,
    opacity: 0.5,
  },
});
