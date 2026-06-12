// ── Sortable Player List (sub-component of PhaseSorting) ──
//
// Drag-and-drop list of player pills. Players are reordered from
// lowest (top) → highest (bottom) secret number by the team.
//
// Uses react-native-reanimated + react-native-gesture-handler.
// Each pill is draggable via Gesture.Pan. While dragging, the pill
// scales up and casts a shadow. On release it snaps to its new slot
// and the order array is re-sorted.

import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle } from 'react-native-svg';
import type { PlayerAssignment } from '@/features/secret-number/types';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

// -- Constants ----------------------------------------------------

const ITEM_HEIGHT = 64;
const ITEM_GAP = 10;
const ITEM_TOTAL = ITEM_HEIGHT + ITEM_GAP;

const ACCENT_COLORS = [
  COLORS.mint,
  COLORS.yellow,
  COLORS.pink,
  COLORS.sky,
  COLORS.purple,
  COLORS.tomato,
];

// -- Grip icon (drag handle dots) ---------------------------------

function GripIcon() {
  return (
    <Svg width={14} height={16} viewBox="0 0 14 16" fill="none">
      <Circle cx={4} cy={4} r="1.5" fill={COLORS.ink} opacity={0.5} />
      <Circle cx={10} cy={4} r="1.5" fill={COLORS.ink} opacity={0.5} />
      <Circle cx={4} cy={8} r="1.5" fill={COLORS.ink} opacity={0.5} />
      <Circle cx={10} cy={8} r="1.5" fill={COLORS.ink} opacity={0.5} />
      <Circle cx={4} cy={12} r="1.5" fill={COLORS.ink} opacity={0.5} />
      <Circle cx={10} cy={12} r="1.5" fill={COLORS.ink} opacity={0.5} />
    </Svg>
  );
}

// -- Single draggable pill ----------------------------------------

interface SortablePillProps {
  item: PlayerAssignment;
  index: number;
  itemCount: number;
  accentColor: string;
  avatarUri?: string;
  activeIndex: SharedValue<number>;
  onDragEnd: (from: number, to: number) => void;
}

function SortablePill({
  item,
  index,
  itemCount,
  accentColor,
  avatarUri,
  activeIndex,
  onDragEnd,
}: SortablePillProps) {
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      isActive.value = 1;
      activeIndex.value = index;
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      // Calculate which slot the pill landed in
      const finalY = index * ITEM_TOTAL + translateY.value;
      const rawTarget = Math.round(finalY / ITEM_TOTAL);
      const targetIndex = Math.max(0, Math.min(rawTarget, itemCount - 1));

      isActive.value = 0;
      translateY.value = withSpring(0);
      activeIndex.value = -1;

      runOnJS(onDragEnd)(index, targetIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: 1 + isActive.value * 0.04 },
    ],
    zIndex: isActive.value > 0.5 ? 10 : 1,
    shadowOpacity: 0.1 + isActive.value * 0.3,
    elevation: 2 + isActive.value * 8,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.pillWrap, animatedStyle]}>
        <View style={[styles.pill, { backgroundColor: accentColor }]}>
          {/* Avatar circle */}
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} resizeMode="cover" />
            ) : (
              <Text style={styles.initial}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          {/* Name */}
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={{ flex: 1 }} />

          {/* Drag handle */}
          <View style={styles.grip}>
            <GripIcon />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// -- Main list component ------------------------------------------

interface SortablePlayerListProps {
  assignments: PlayerAssignment[];
  avatars: Record<string, string>;
  onOrderChange: (order: PlayerAssignment[]) => void;
}

export default function SortablePlayerList({
  assignments,
  avatars,
  onOrderChange,
}: SortablePlayerListProps) {
  const activeIndex = useSharedValue(-1);

  function handleDragEnd(from: number, to: number) {
    if (from === to) return;
    const next = [...assignments];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onOrderChange(next);
  }

  return (
    <View style={styles.container}>
      {assignments.map((item, i) => (
        <SortablePill
          key={item.name}
          item={item}
          index={i}
          itemCount={assignments.length}
          accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          avatarUri={avatars[item.name]}
          activeIndex={activeIndex}
          onDragEnd={handleDragEnd}
        />
      ))}
    </View>
  );
}

// -- Styles -------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    gap: ITEM_GAP,
    paddingTop: 8,
  },
  pillWrap: {
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    borderRadius: RADIUS.pill,
  },
  pill: {
    height: ITEM_HEIGHT,
    borderRadius: RADIUS.pill,
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingRight: 8,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  grip: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
});
