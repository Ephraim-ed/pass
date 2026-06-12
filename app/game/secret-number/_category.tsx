// ── Phase 2: Choosing Category ──
//
// Players pick a category from 50 options (or roll "Random").
// A search bar at the top filters categories in real-time.
// Selected category is highlighted; Next is disabled until one is picked.
//
// The category becomes the theme — each player privately thinks of a
// subject within it that matches their secret number's value.

import { useState, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import Sticker from "@/components/ui/Sticker";
import StickerButton from "@/components/ui/StickerButton";
import Bub from "@/components/mascot/Bub";
import { CATEGORIES } from "@/features/secret-number/data";
import type { CategoryId } from "@/features/secret-number/types";
import { COLORS, FONTS, RADIUS } from "@/theme/tokens";

// -- Accent colour rotation for category cards -------------------

const CARD_COLORS = [
  COLORS.mint,
  COLORS.yellow,
  COLORS.sky,
  COLORS.purple,
  COLORS.pink,
];
const CARD_ROTS = [-1, 0.5, -0.3, 0.8, -0.6, 1, -0.4, 0.3];

function cardColor(i: number) {
  return CARD_COLORS[i % CARD_COLORS.length];
}

function cardRot(i: number) {
  return CARD_ROTS[i % CARD_ROTS.length];
}

// -- Dice SVG icon -----------------------------------------------

function DiceIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="7"
        fill="#fff"
        stroke={COLORS.ink}
        strokeWidth="2.5"
      />
      <Circle cx="12" cy="12" r="3" fill={COLORS.ink} />
      <Circle cx="28" cy="12" r="3" fill={COLORS.ink} />
      <Circle cx="20" cy="20" r="3" fill={COLORS.ink} />
      <Circle cx="12" cy="28" r="3" fill={COLORS.ink} />
      <Circle cx="28" cy="28" r="3" fill={COLORS.ink} />
    </Svg>
  );
}

// -- Back button (same pattern as PhaseRules) ---------------------

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

// -- Main component -----------------------------------------------

interface PhaseCategoryProps {
  selectedCategory: CategoryId | null;
  onSelectCategory: (id: CategoryId) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function PhaseCategory({
  selectedCategory,
  onSelectCategory,
  onBack,
  onNext,
}: PhaseCategoryProps) {
  const [query, setQuery] = useState("");

  // Real-time filter: case-insensitive substring match
  const filtered = useMemo(() => {
    if (!query.trim()) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  const hasSelection = selectedCategory !== null;

  function rollRandom() {
    const pick = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    onSelectCategory(pick);
  }

  return (
    <View style={styles.container}>
      {/* Top bar: back arrow + header */}
      <View style={styles.topBar}>
        <BackButton onPress={onBack} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.heading}>Pick a category</Text>
          <Text style={styles.subheading}>
            The team will describe subjects within this theme.
          </Text>
        </View>
        <Bub pose="idle" size={56} color={COLORS.mint} />
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search categories..."
          placeholderTextColor={COLORS.ink2}
          style={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Random — prominent horizontal banner above the grid */}
      <View style={styles.randomBanner}>
        <Pressable onPress={rollRandom}>
          <Sticker
            color={COLORS.ink}
            radius={RADIUS.lg}
            shadowY={4}
            rotate={-0.3}
          >
            <View style={styles.randomInner}>
              {/* Icon + text */}
              <View style={styles.randomIconWrap}>
                <DiceIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.randomLabel}>Surprise me!</Text>
                <Text style={styles.randomSub}>
                  Random category — let fate decide.
                </Text>
              </View>

              {/* Arrow */}
              <View style={styles.randomArrow}>
                <Svg width={22} height={18} viewBox="0 0 22 18" fill="none">
                  <Path
                    d="M1 9 H20 M12 1 L20 9 L12 17"
                    stroke={COLORS.cream}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </Sticker>
        </Pressable>
      </View>

      {/* Category grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.map((cat, i) => {
          const isSelected = cat === selectedCategory;
          return (
            <View key={cat} style={styles.cardWrap}>
              <StickerButton
                color={isSelected ? COLORS.ink : cardColor(i)}
                radius={RADIUS.lg}
                shadowY={isSelected ? 2 : 4}
                rotate={cardRot(i)}
                onPress={() => onSelectCategory(cat)}
              >
                <View style={styles.cardInner}>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.cardLabel,
                      isSelected && { color: COLORS.cream },
                      { textAlign: "center" },
                    ]}
                    numberOfLines={2}
                  >
                    {cat}
                  </Text>
                </View>
              </StickerButton>
            </View>
          );
        })}

        {/* Empty state when search yields nothing */}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No categories match "{query}"</Text>
          </View>
        )}
      </ScrollView>

      {/* Next button — pinned bottom */}
      <View style={styles.nextWrap}>
        <StickerButton
          color={hasSelection ? COLORS.mint : COLORS.ink2}
          radius={RADIUS.pill}
          shadowY={hasSelection ? 5 : 0}
          onPress={hasSelection ? onNext : undefined}
        >
          <View style={styles.nextInner}>
            <Text
              style={[
                styles.nextText,
                !hasSelection && { color: COLORS.cream, opacity: 0.5 },
              ]}
            >
              {hasSelection ? `Next: ${selectedCategory}` : "Pick a category"}
            </Text>
            {hasSelection && (
              <Svg width={18} height={14} viewBox="0 0 18 14" fill="none">
                <Path
                  d="M1 7 H16 M10 1 L16 7 L10 13"
                  stroke={COLORS.ink}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 16,
    gap: 0,
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
  searchWrap: {
    marginHorizontal: 22,
    marginTop: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2.5,
    borderColor: COLORS.ink,
    borderRadius: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: 15,
    color: COLORS.ink,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  clearText: {
    fontFamily: FONTS.uiBold,
    fontSize: 14,
    color: COLORS.ink2,
  },

  // -- Random banner --
  randomBanner: {
    marginHorizontal: 22,
    marginBottom: 14,
  },
  randomInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  randomIconWrap: {
    marginRight: 14,
  },
  randomLabel: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.cream,
    letterSpacing: -0.3,
  },
  randomSub: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.cream,
    opacity: 0.65,
    marginTop: 2,
  },
  randomArrow: {
    marginLeft: 8,
    zIndex: 1,
  },

  // -- Grid --
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  cardWrap: {
    width: "50%",
    padding: 6,
  },
  cardInner: {
    padding: 16,
    minHeight: 72,
    justifyContent: "center",
  },
  cardLabel: {
    fontFamily: FONTS.display,
    fontSize: 14,
    color: COLORS.ink,
    letterSpacing: -0.2,
    lineHeight: 17,
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.mint,
    borderWidth: 2,
    borderColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    color: COLORS.ink,
    lineHeight: 14,
  },
  empty: {
    width: "100%",
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FONTS.ui,
    fontSize: 15,
    color: COLORS.ink2,
  },

  // -- Next button --
  nextWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  nextInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  nextText: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: COLORS.ink,
  },
});
