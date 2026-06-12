// ── Confirm Modal (shared utility) ──
//
// Generic yes/no confirmation popup used across multiple phases:
//   Phase 3 — "Numbers will be voided. Restart sequence?"
//   Phase 4 — "Is this your final decision?" + sorted order preview
//   Phase 5 — "Are you sure you want to exit?"
//
// Renders a sticker card inside a semi-transparent overlay.
// Accepts optional children for extra content (e.g. sorted list preview).

import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import StickerButton from '@/components/ui/StickerButton';
import { COLORS, FONTS } from '@/theme/tokens';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {children}
            {/* TODO: add Bub mascot inside modal */}
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelLabel}</Text>
              </Pressable>
              <StickerButton color={COLORS.pink} radius={14} shadowY={3} onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              </StickerButton>
            </View>
          </View>
        </Pressable>
      </Pressable>
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
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.ink,
    marginBottom: 8,
  },
  message: {
    fontFamily: FONTS.ui,
    fontSize: 14,
    color: COLORS.ink2,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  cancelText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink,
  },
  confirmText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});
