// ── End Game Modal (post-game popup) ──
//
// Shown after all results are revealed. Displays final score with
// a randomized message that matches the team's performance:
//   Perfect (all correct) → triumphant messages
//   Good (>50%)         → encouraging messages
//   Okay (any right)    → keep-at-it messages
//   None (zero correct) → playful roast messages
//
// Offers Redo (back to Phase 2) or Exit (back to Home).

import { useMemo } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import StickerButton from '@/components/ui/StickerButton';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

interface EndGameModalProps {
  visible: boolean;
  correctCount: number;
  totalPlayers: number;
  onRedo: () => void;
  onExit: () => void;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PERFECT = [
  'Flawless. The team is in sync.',
  'Perfection. Not a single slip.',
  'Absolutely nailed every spot.',
  'Mind readers. Every single one.',
];

const GREAT = [
  'Solid teamwork right there.',
  'Impressive. Most of them landed.',
  'The team\'s got good instincts.',
  'Almost a clean sweep — well played.',
];

const OKAY = [
  'Not bad — a few good calls in there.',
  'Some hits, some misses. That\'s the game.',
  'Decent reads. Room for a rematch.',
  'The team showed up. Mostly.',
];

const NONE = [
  'Yikes. The group chat failed.',
  'Zero. Absolutely none. Impressive in its own way.',
  'Not a single one. Time for a redo?',
  'The vibes were off. Try again?',
];

export default function EndGameModal({
  visible,
  correctCount,
  totalPlayers,
  onRedo,
  onExit,
}: EndGameModalProps) {
  const ratio = totalPlayers > 0 ? correctCount / totalPlayers : 0;

  const message = useMemo(() => {
    if (ratio === 1) return pick(PERFECT);
    if (ratio > 0.5) return pick(GREAT);
    if (ratio > 0) return pick(OKAY);
    return pick(NONE);
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Game Over!</Text>
          <Text style={styles.score}>
            {correctCount} out of {totalPlayers} in the right spot!
          </Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <StickerButton color={COLORS.yellow} radius={RADIUS.pill} shadowY={3} onPress={onRedo}>
              <Text style={styles.btnText}>Play Again</Text>
            </StickerButton>
            <StickerButton color={COLORS.ink} radius={RADIUS.pill} shadowY={3} onPress={onExit}>
              <Text style={[styles.btnText, { color: COLORS.cream }]}>Home</Text>
            </StickerButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,22,38,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 22,
    padding: 24,
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    minWidth: 280,
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: COLORS.ink,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  score: {
    fontFamily: FONTS.ui,
    fontSize: 16,
    color: COLORS.ink2,
    textAlign: 'center',
    lineHeight: 22,
  },
  message: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
});
