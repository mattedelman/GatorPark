import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { getAvailabilityColor } from '../utils/parking';
import AvailabilityBadge from './AvailabilityBadge';

export default function GarageCard({ garage, onPress }) {
  const color = getAvailabilityColor(garage.availableSpaces, garage.totalSpaces);
  const percentage = Math.round((garage.availableSpaces / garage.totalSpaces) * 100);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
          <Ionicons
            name={garage.floors > 1 ? 'car-sport' : 'car'}
            size={22}
            color={color}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{garage.name}</Text>
          <View style={styles.meta}>
            <Ionicons name="layers-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>
              {garage.floors > 1 ? `${garage.floors} floors` : 'Surface lot'}
            </Text>
            <Text style={styles.metaDot}>·</Text>
            <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{garage.hours}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={[styles.spotsNum, { color }]}>{garage.availableSpaces}</Text>
          <Text style={styles.spotsLabel}>spots</Text>
        </View>
      </View>

      <View style={styles.barRow}>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${100 - percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={[styles.barPct, { color }]}>{percentage}% free</Text>
      </View>

      <View style={styles.footer}>
        <AvailabilityBadge
          available={garage.availableSpaces}
          total={garage.totalSpaces}
          size="sm"
        />
        <View style={styles.permitRow}>
          {garage.permits.slice(0, 3).map((p) => (
            <View key={p} style={styles.permitChip}>
              <Text style={styles.permitText}>{p}</Text>
            </View>
          ))}
          {garage.permits.length > 3 && (
            <Text style={styles.morePermits}>+{garage.permits.length - 3}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.sm + 4,
  },
  name: {
    ...FONTS.subheading,
    color: COLORS.text,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  metaDot: {
    color: COLORS.textSecondary,
    marginHorizontal: 5,
    fontSize: 10,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  spotsNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  spotsLabel: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginTop: -2,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm + 4,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  barPct: {
    ...FONTS.small,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    width: 52,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm + 2,
  },
  permitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permitChip: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  permitText: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
    fontSize: 10,
  },
  morePermits: {
    ...FONTS.small,
    color: COLORS.textLight,
    marginLeft: 4,
    fontSize: 10,
  },
});
