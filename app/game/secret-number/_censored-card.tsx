// ── Censored Card (sub-component of PhaseDistribution) ──
//
// One card per player during the reveal loop.
// Before reveal: locked/obscured number with "Reveal" button.
// After reveal: shows the secret number + "Got the secret number memorized?"
// + a button to pass the phone to the next player.
//
// CRITICAL: the number re-censors each time a new player starts.
// Only the current player sees their own number — never anyone else's.

import { Text, View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Sticker from '@/components/ui/Sticker';
import StickerButton from '@/components/ui/StickerButton';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

interface CensoredCardProps {
  playerName: string;
  secretNumber: number;
  isRevealed: boolean;
  onReveal: () => void;
  onNext: () => void;
  isLast: boolean;
}

// -- Lock icon for the censored state -----------------------------

function LockIcon() {
  return (
    <Svg width={28} height={34} viewBox="0 0 28 34" fill="none">
      <Rect x="4" y="12" width="20" height="18" rx="3" fill={COLORS.ink} />
      <Path d="M8 12 V8 A6 6 0 0 1 20 8 V12" stroke={COLORS.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Circle cx="14" cy="22" r="2.5" fill={COLORS.cream} />
      <Path d="M14 24 V26" stroke={COLORS.cream} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// -- Arrow right icon ---------------------------------------------

function ArrowRight() {
  return (
    <Svg width={14} height={12} viewBox="0 0 18 14" fill="none">
      <Path d="M1 7 H16 M10 1 L16 7 L10 13" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// -- Main component -----------------------------------------------

export default function CensoredCard({
  playerName,
  secretNumber,
  isRevealed,
  onReveal,
  onNext,
  isLast,
}: CensoredCardProps) {
  return (
    <View style={styles.container}>
      {/* Player turn heading */}
      <Text style={styles.turnLabel}>It's</Text>
      <Text style={styles.playerName}>{playerName}'s</Text>
      <Text style={styles.turnLabel}>Turn!</Text>

      {/* The card itself */}
      <View style={styles.cardWrap}>
        <Sticker
          color={isRevealed ? COLORS.mint : COLORS.ink}
          radius={RADIUS.xl}
          shadowY={5}
          rotate={isRevealed ? 0 : -0.5}
        >
          <View style={[styles.cardInner, isRevealed ? styles.cardRevealed : styles.cardHidden]}>
            {isRevealed ? (
              /* === REVEALED: show the number === */
              <View style={styles.revealContent}>
                <View style={styles.secretBadge}>
                  <Text style={styles.secretLabel}>SECRET NUMBER</Text>
                </View>
                <Text style={styles.number}>{secretNumber}</Text>
              </View>
            ) : (
              /* === HIDDEN: lock + censored text === */
              <View style={styles.hiddenContent}>
                <LockIcon />
                <Text style={styles.censoredText}>[ CENSORED ]</Text>
                <Text style={styles.censoredSub}>
                  Only {playerName} can reveal this.
                </Text>
              </View>
            )}
          </View>
        </Sticker>
      </View>

      {/* Actions below the card */}
      <View style={styles.actions}>
        {isRevealed ? (
          <>
            <Text style={styles.memorizedPrompt}>
              Got the secret number memorized?
            </Text>
            <StickerButton
              color={COLORS.mint}
              radius={RADIUS.pill}
              shadowY={4}
              onPress={onNext}
            >
              <View style={styles.nextInner}>
                <Text style={styles.nextLabel}>
                  {isLast ? 'Done ✓' : 'Pass phone to next player'}
                </Text>
                {!isLast && <ArrowRight />}
              </View>
            </StickerButton>
          </>
        ) : (
          <StickerButton
            color={COLORS.yellow}
            radius={RADIUS.pill}
            shadowY={5}
            onPress={onReveal}
          >
            <View style={styles.revealBtn}>
              <Text style={styles.revealBtnText}>Reveal Secret Number</Text>
            </View>
          </StickerButton>
        )}
      </View>
    </View>
  );
}

// -- Styles -------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  turnLabel: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.ink2,
    letterSpacing: 1.4,
  },
  playerName: {
    fontFamily: FONTS.display,
    fontSize: 36,
    color: COLORS.ink,
    letterSpacing: -0.8,
    marginVertical: 2,
  },
  cardWrap: {
    width: '100%',
    marginTop: 24,
  },
  cardInner: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  cardHidden: {
    gap: 16,
  },
  cardRevealed: {
    gap: 8,
  },

  // -- Hidden state --
  hiddenContent: {
    alignItems: 'center',
    gap: 12,
  },
  censoredText: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    color: COLORS.cream,
    letterSpacing: 3,
  },
  censoredSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.cream,
    opacity: 0.5,
  },

  // -- Revealed state --
  revealContent: {
    alignItems: 'center',
    gap: 8,
  },
  secretBadge: {
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  secretLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.cream,
    letterSpacing: 1.2,
  },
  number: {
    fontFamily: FONTS.display,
    fontSize: 80,
    color: COLORS.ink,
    lineHeight: 84,
    letterSpacing: -2,
  },

  // -- Actions --
  actions: {
    marginTop: 28,
    width: '100%',
    alignItems: 'center',
  },
  memorizedPrompt: {
    fontFamily: FONTS.ui,
    fontSize: 14,
    color: COLORS.inkSoft,
    marginBottom: 16,
    textAlign: 'center',
  },
  revealBtn: {
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  revealBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: COLORS.ink,
  },
  nextInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  nextLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: COLORS.ink,
  },
});
