// ── Phase 5: Results ──
//
// Suspenseful reveal: the team's order is shown, but the answer key
// is HIDDEN until each row is revealed one by one.
//
// Each tap of "Reveal" uncovers:
//   - Your player's secret number
//   - Who SHOULD have been in that position
//   - ✓ CORRECT or ✗ MISPLACED (with the correct player shown)
//
// Scoring: "X out of Y in the right spot!" — positive-only, no negativity.
// "Reveal All" for the impatient. Auto-shows EndGameModal after all revealed.

import { useState, useCallback, useEffect } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Bub from '@/components/mascot/Bub';
import Sticker from '@/components/ui/Sticker';
import ResultPlayerRow from './_result-row';
import ConfirmModal from '@/components/shared/ConfirmModal';
import EndGameModal from '@/components/shared/EndGameModal';
import type { PlayerAssignment } from '@/features/secret-number/types';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

// -- Back button --------------------------------------------------

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.backBtn} onPress={onPress}>
      <Svg width={16} height={14} viewBox="0 0 16 14" fill="none">
        <Path d="M15 7 H1 M7 1 L1 7 L7 13" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

// -- Main component -----------------------------------------------

interface PhaseResultsProps {
  submittedOrder: PlayerAssignment[];
  correctOrder: PlayerAssignment[];
  avatars: Record<string, string>;
  onExit: () => void;
  onRedo: () => void;
  onGoHome: () => void;
}

export default function PhaseResults({
  submittedOrder,
  correctOrder,
  avatars,
  onExit,
  onRedo,
  onGoHome,
}: PhaseResultsProps) {
  // Track which positions have been revealed
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showEndGame, setShowEndGame] = useState(false);

  const totalPlayers = submittedOrder.length;

  // Full count for EndGameModal (only meaningful after all revealed)
  const fullCorrectCount = submittedOrder.filter(
    (sub, i) => sub.name === correctOrder[i]?.name,
  ).length;

  // Only count revealed positions — score unfolds one by one
  const revealedCorrectCount = submittedOrder.filter(
    (sub, i) => revealed.has(i) && sub.name === correctOrder[i]?.name,
  ).length;

  const allRevealed = revealed.size >= totalPlayers;
  const someRevealed = revealed.size > 0;

  const handleReveal = useCallback((index: number) => {
    setRevealed((prev) => new Set(prev).add(index));
  }, []);

  const handleRevealAll = useCallback(() => {
    setRevealed(new Set(submittedOrder.map((_, i) => i)));
  }, [submittedOrder]);

  // Auto-show end game modal after all revealed
  useEffect(() => {
    if (allRevealed && !showEndGame) {
      const t = setTimeout(() => setShowEndGame(true), 500);
      return () => clearTimeout(t);
    }
  }, [allRevealed, showEndGame]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => setShowExitConfirm(true)} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.heading}>Results</Text>
          <Text style={styles.subheading}>
            {allRevealed
              ? 'All revealed!'
              : someRevealed
                ? `${revealed.size} of ${totalPlayers} revealed`
                : 'Tap Reveal to uncover each position.'}
          </Text>
        </View>
        <Bub pose="cheer" size={56} color={COLORS.yellow} hat={COLORS.mint} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Score card — suspense: only shows count if any revealed */}
        <Sticker color={COLORS.mint} radius={RADIUS.lg} shadowY={4} rotate={0}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>TEAM SCORE</Text>
            {someRevealed ? (
              <>
                <Text style={styles.scoreValue}>
                  {revealedCorrectCount} / {revealed.size}
                </Text>
                <Text style={styles.scoreSub}>in the right spot so far</Text>
              </>
            ) : (
              <Text style={styles.scoreMystery}>???</Text>
            )}
          </View>
        </Sticker>

        {/* Reveal All — only if some remain hidden */}
        {!allRevealed && (
          <View style={styles.revealAllWrap}>
            <Pressable onPress={handleRevealAll} style={styles.revealAllBtn}>
              <Text style={styles.revealAllText}>
                {someRevealed ? 'Reveal Remaining' : 'Reveal All'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Player cards — one per position */}
        <View style={styles.cardList}>
          {submittedOrder.map((submitted, i) => {
            const correct = correctOrder[i];
            return (
              <ResultPlayerRow
                key={i}
                position={i + 1}
                submitted={submitted}
                correct={correct}
                isRevealed={revealed.has(i)}
                avatarUri={avatars[submitted.name]}
                correctAvatarUri={avatars[correct.name]}
                onReveal={() => handleReveal(i)}
              />
            );
          })}
        </View>

        {/* Bottom spacing so last card isn't cut off */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Exit confirmation */}
      <ConfirmModal
        visible={showExitConfirm}
        title="Leave results?"
        message="Are you sure you want to exit the results screen?"
        confirmLabel="Yes, exit"
        cancelLabel="Stay"
        onConfirm={() => {
          setShowExitConfirm(false);
          onExit();
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      {/* End game modal */}
      <EndGameModal
        visible={showEndGame}
        correctCount={fullCorrectCount}
        totalPlayers={totalPlayers}
        onRedo={onRedo}
        onExit={onGoHome}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
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
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 80,
  },

  // -- Score card --
  scoreCard: {
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.ink,
    letterSpacing: 1.4,
    opacity: 0.6,
  },
  scoreValue: {
    fontFamily: FONTS.display,
    fontSize: 44,
    color: COLORS.ink,
    letterSpacing: -1.5,
    lineHeight: 46,
    marginTop: 2,
  },
  scoreSub: {
    fontFamily: FONTS.ui,
    fontSize: 15,
    color: COLORS.inkSoft,
    marginTop: 2,
  },
  scoreMystery: {
    fontFamily: FONTS.mono,
    fontSize: 36,
    color: COLORS.ink,
    letterSpacing: 6,
    marginTop: 4,
    opacity: 0.3,
  },

  // -- Reveal All --
  revealAllWrap: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  revealAllBtn: {
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 24,
    paddingVertical: 11,
    backgroundColor: COLORS.cream2,
  },
  revealAllText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink,
  },

  // -- Card list --
  cardList: {
    marginTop: 18,
  },
});
