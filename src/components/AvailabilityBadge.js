import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { getAvailabilityColor, getAvailabilityLabel } from '../utils/parking';

export default function AvailabilityBadge({ available, total, size = 'md' }) {
  const color = getAvailabilityColor(available, total);
  const label = getAvailabilityLabel(available, total);
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: color }, isSmall && styles.dotSm]} />
      <Text style={[styles.label, { color }, isSmall && styles.labelSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs + 2,
  },
  dotSm: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  label: {
    ...FONTS.caption,
    fontWeight: '700',
  },
  labelSm: {
    fontSize: 10,
  },
});
