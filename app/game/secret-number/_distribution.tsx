// ── Phase 3: Number Distribution ──
//
// Players take turns seeing their secret number — privately, one at a time.
//
// Flow:
//   1. "Pass the phone to {Player}" interstitial → "I'm Ready" button
//   2. CensoredCard (number hidden) → "Reveal Secret Number"
//   3. Number revealed → "Got the secret number memorized?"
//   4. "Pass phone to next player" → RE-CENSORS the number → back to step 1
//
// CRITICAL: the number is automatically re-censored between players.
// Once you tap "next", your number is hidden again. No going back.
// This is a pass-the-phone party game — physical phone handoff required.

import { useState, useEffect, useCallback } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Bub from "@/components/mascot/Bub";
import StickerButton from "@/components/ui/StickerButton";
import CensoredCard from "./_censored-card";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { PlayerAssignment } from "@/features/secret-number/types";
import { COLORS, FONTS, RADIUS } from "@/theme/tokens";

// -- Back button --------------------------------------------------

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

// -- Pass-the-phone interstitial (between players) ----------------

function PassPhonePrompt({
  playerName,
  playerNumber,
  totalPlayers,
  onReady,
}: {
  playerName: string;
  playerNumber: number;
  totalPlayers: number;
  onReady: () => void;
}) {
  return (
    <View style={styles.passWrap}>
      <Text style={styles.passLabel}>Pass the phone to</Text>
      <Text style={styles.passName}>{playerName}</Text>
      <Text style={styles.passCount}>
        Player {playerNumber} of {totalPlayers}
      </Text>
      <Text style={styles.passHint}>
        Make sure nobody else is looking at the screen.
      </Text>
      <StickerButton
        color={COLORS.yellow}
        radius={RADIUS.pill}
        shadowY={5}
        onPress={onReady}
      >
        <View style={styles.readyBtn}>
          <Text style={styles.readyBtnText}>I'm Ready</Text>
        </View>
      </StickerButton>
    </View>
  );
}

// -- Main component -----------------------------------------------

interface PhaseDistributionProps {
  players: string[];
  assignments: PlayerAssignment[];
  onGenerate: () => void;
  onBack: () => void;
  onStartGame: () => void;
}

export default function PhaseDistribution({
  players,
  assignments,
  onGenerate,
  onBack,
  onStartGame,
}: PhaseDistributionProps) {
  // Generate numbers on first mount
  useEffect(() => {
    onGenerate();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  // isPassing=true  → showing "Pass the phone to X" interstitial
  // isPassing=false → showing the CensoredCard
  const [isPassing, setIsPassing] = useState(true);
  // Has the CURRENT player revealed their number?
  const [isRevealed, setIsRevealed] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const isDone = currentIndex >= assignments.length;
  const currentPlayer = isDone ? null : assignments[currentIndex];
  const isLast = currentIndex >= assignments.length - 1;

  // "I'm Ready" — transition from interstitial to censored card
  const handleReady = useCallback(() => {
    setIsPassing(false);
    setIsRevealed(false);
  }, []);

  // "Reveal Secret Number" — uncensor the current player's number
  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  // "Pass phone to next player" / "Done" — re-censor and advance
  const handleNext = useCallback(() => {
    if (isLast) {
      // Loop complete — move to done screen
      setCurrentIndex(assignments.length);
      setIsPassing(false);
      setIsRevealed(false);
    } else {
      // Advance to next player, START CENSORED
      setCurrentIndex((prev) => prev + 1);
      setIsPassing(true);
      setIsRevealed(false); // ← RE-CENSOR: previous number is gone
    }
  }, [isLast, assignments.length]);

  // "Redo Distribution" — wipe and restart
  const handleRedo = useCallback(() => {
    onGenerate();
    setCurrentIndex(0);
    setIsPassing(true);
    setIsRevealed(false);
  }, [onGenerate]);

  return (
    <View style={styles.container}>
      {/* Header: back + title + Bub */}
      <View style={styles.header}>
        <BackButton onPress={() => setShowBackConfirm(true)} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.heading}>Number Distribution</Text>
          <Text style={styles.subheading}>
            {isDone
              ? "All numbers assigned!"
              : `Passing the phone — one player at a time`}
          </Text>
        </View>
        <Bub pose="peek" size={56} color={COLORS.mint} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {isDone ? (
          /* === All players done === */
          <View style={styles.doneWrap}>
            <Text style={styles.doneHeading}>All numbers revealed!</Text>
            <Text style={styles.doneSub}>
              Everyone has their secret number memorized. Ready to sort?
            </Text>

            <View style={styles.doneActions}>
              <StickerButton
                color={COLORS.mint}
                radius={RADIUS.pill}
                shadowY={5}
                onPress={onStartGame}
                style={{ width: "100%" }}
              >
                <View style={styles.doneBtn}>
                  <Text style={styles.doneBtnText}>Start Game</Text>
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

              <Pressable onPress={handleRedo} style={styles.redoBtn}>
                <Text style={styles.redoBtnText}>↻ Redo Distribution</Text>
              </Pressable>
            </View>
          </View>
        ) : isPassing ? (
          /* === Pass phone interstitial === */
          <PassPhonePrompt
            playerName={currentPlayer?.name ?? ""}
            playerNumber={currentIndex + 1}
            totalPlayers={assignments.length}
            onReady={handleReady}
          />
        ) : currentPlayer ? (
          /* === Active player — censored card === */
          <CensoredCard
            playerName={currentPlayer.name}
            secretNumber={currentPlayer.number}
            isRevealed={isRevealed}
            onReveal={handleReveal}
            onNext={handleNext}
            isLast={isLast}
          />
        ) : null}
      </View>

      {/* Back confirmation modal */}
      <ConfirmModal
        visible={showBackConfirm}
        title="Go back?"
        message="Current assigned numbers will be voided and the sequence will restart."
        confirmLabel="Yes, go back"
        cancelLabel="Stay"
        onConfirm={() => {
          setShowBackConfirm(false);
          onBack();
        }}
        onCancel={() => setShowBackConfirm(false)}
      />
    </View>
  );
}

// -- Styles -------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  heading: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.ink,
    letterSpacing: -0.4,
  },
  subheading: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.inkSoft,
    marginTop: 2,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },

  // -- Pass phone interstitial --
  passWrap: {
    alignItems: "center",
    paddingHorizontal: 22,
    gap: 8,
  },
  passLabel: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.ink2,
    letterSpacing: 1.4,
  },
  passName: {
    fontFamily: FONTS.display,
    fontSize: 42,
    color: COLORS.ink,
    letterSpacing: -1,
    textAlign: "center",
    lineHeight: 46,
    marginVertical: 4,
  },
  passCount: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.ink2,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  passHint: {
    fontFamily: FONTS.ui,
    fontSize: 14,
    color: COLORS.inkSoft,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 260,
  },
  readyBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  readyBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.ink,
  },

  // -- Done state (loop complete) --
  doneWrap: {
    alignItems: "center",
    paddingHorizontal: 22,
    gap: 12,
  },
  doneHeading: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.ink,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  doneSub: {
    fontFamily: FONTS.ui,
    fontSize: 15,
    color: COLORS.inkSoft,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  doneActions: {
    width: "100%",
    alignItems: "center",
    gap: 14,
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  doneBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.ink,
  },
  redoBtn: {
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: COLORS.cream2,
  },
  redoBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.ink,
  },
});
