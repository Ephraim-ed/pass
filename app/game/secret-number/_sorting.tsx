// ── Phase 4: Sorting Phase ──
//
// Players discuss as a team and arrange themselves from lowest→highest
// secret number using a drag-and-drop interface.
//
// The team describes their chosen subject without revealing their
// actual secret number. (e.g. "I picked Pizza — cheap and universally
// loved" implies a low number; "I picked Wagyu" implies a high number.)
//
// "Finalize" shows a confirmation modal with the proposed order.
// Confirming locks the order and transitions to Phase 5 (results).

import { useState, useCallback } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Bub from '@/components/mascot/Bub';
import StickerButton from '@/components/ui/StickerButton';
import SortablePlayerList from './_sortable-list';
import ConfirmModal from '@/components/shared/ConfirmModal';
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

interface PhaseSortingProps {
  assignments: PlayerAssignment[];
  avatars: Record<string, string>;
  onBack: () => void;
  onFinalize: (order: PlayerAssignment[]) => void;
}

export default function PhaseSorting({
  assignments,
  avatars,
  onBack,
  onFinalize,
}: PhaseSortingProps) {
  // The current drag-and-drop order (starts as a copy of assignments)
  const [order, setOrder] = useState<PlayerAssignment[]>([...assignments]);
  // Confirm-back modal
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  // Finalize confirmation modal
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  const handleOrderChange = useCallback((newOrder: PlayerAssignment[]) => {
    setOrder(newOrder);
  }, []);

  const handleFinalizeConfirm = useCallback(() => {
    setShowFinalizeConfirm(false);
    onFinalize(order);
  }, [order, onFinalize]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => setShowBackConfirm(true)} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.heading}>Sort the crew</Text>
          <Text style={styles.subheading}>
            Drag players from lowest to highest
          </Text>
        </View>
        <Bub pose="wave" size={56} color={COLORS.mint} hat={COLORS.pink} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Discussion prompt */}
        <View style={styles.promptWrap}>
          <Text style={styles.prompt}>
            Work as a team — describe the subject you picked{'\n'}
            to help others understand its relative position.
          </Text>
        </View>

        {/* Sortable list */}
        <SortablePlayerList
          assignments={order}
          avatars={avatars}
          onOrderChange={handleOrderChange}
        />

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>↑</Text>
            <Text style={styles.legendText}>Lowest number</Text>
          </View>
          <View style={styles.legendRow}>
            <Text style={styles.legendLabel}>↓</Text>
            <Text style={styles.legendText}>Highest number</Text>
          </View>
        </View>
      </ScrollView>

      {/* Finalize button — pinned to bottom */}
      <View style={styles.finalizeWrap}>
        <StickerButton
          color={COLORS.mint}
          radius={RADIUS.pill}
          shadowY={5}
          onPress={() => setShowFinalizeConfirm(true)}
        >
          <View style={styles.finalizeInner}>
            <Text style={styles.finalizeText}>Finalize Order</Text>
            <Svg width={18} height={14} viewBox="0 0 18 14" fill="none">
              <Path d="M1 7 H16 M10 1 L16 7 L10 13" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </StickerButton>
      </View>

      {/* Finalize confirmation modal */}
      <ConfirmModal
        visible={showFinalizeConfirm}
        title="Lock in your order?"
        message="This is your team's final decision. You won't be able to change it."
        confirmLabel="Yes, finalize"
        cancelLabel="Keep sorting"
        onConfirm={handleFinalizeConfirm}
        onCancel={() => setShowFinalizeConfirm(false)}
      >
        {/* Order preview inside the modal */}
        <View style={styles.previewList}>
          {order.map((p, i) => (
            <View key={p.name} style={styles.previewRow}>
              <Text style={styles.previewNum}>{i + 1}.</Text>
              <Text style={styles.previewName}>{p.name}</Text>
            </View>
          ))}
        </View>
      </ConfirmModal>

      {/* Back confirmation modal */}
      <ConfirmModal
        visible={showBackConfirm}
        title="Leave sorting?"
        message="Going back will void all assigned numbers and restart the sequence."
        confirmLabel="Yes, leave"
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
    paddingBottom: 120,
  },

  // -- Prompt --
  promptWrap: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
  },
  prompt: {
    fontFamily: FONTS.ui,
    fontSize: 14,
    color: COLORS.inkSoft,
    lineHeight: 21,
  },

  // -- Legend --
  legend: {
    paddingHorizontal: 22,
    paddingTop: 16,
    gap: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendLabel: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.ink2,
    width: 14,
    textAlign: 'center',
  },
  legendText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.ink2,
    letterSpacing: 0.5,
  },

  // -- Finalize button --
  finalizeWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  finalizeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  finalizeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.ink,
  },

  // -- Order preview (inside confirmation modal) --
  previewList: {
    marginTop: 16,
    gap: 4,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.cream2,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.ink,
  },
  previewNum: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    color: COLORS.ink2,
    width: 24,
  },
  previewName: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink,
  },
});
