import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

export default function FilterChip({ label, color, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: (color || COLORS.primary) + '18', borderColor: color || COLORS.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {color && (
        <View style={[styles.dot, { backgroundColor: color }]} />
      )}
      <Text
        style={[
          styles.label,
          selected && { color: color || COLORS.primary, fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm + 6,
    paddingVertical: SPACING.xs + 3,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});
