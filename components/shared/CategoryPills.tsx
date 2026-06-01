import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CATEGORIES, CategoryId } from '@/data/games';
import { COLORS, FONTS, RADIUS } from '@/theme/tokens';

type Props = {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
};

export default function CategoryPills({ active, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, flexDirection: 'row' }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === active;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 9,
              borderRadius: RADIUS.pill,
              backgroundColor: isActive ? COLORS.ink : COLORS.cream2,
              borderWidth: 2,
              borderColor: COLORS.ink,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.uiBold,
                fontSize: 13,
                color: isActive ? COLORS.cream : COLORS.ink,
              }}
            >
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
