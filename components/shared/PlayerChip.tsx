import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  name: string;
  accentColor?: string;
  onRemove?: () => void;
  removable?: boolean;
};

export default function PlayerChip({ name, accentColor = COLORS.mint, onRemove, removable = false }: Props) {
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: accentColor, borderColor: COLORS.ink },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      {removable && onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.remove}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    gap: 6,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: COLORS.cream,
  },
  name: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.ink,
    maxWidth: 80,
  },
  remove: {
    marginLeft: 2,
  },
  removeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: COLORS.ink,
    lineHeight: 18,
  },
});
