import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function OccupancyChart({ peakHours }) {
  const currentHour = new Date().getHours();
  const maxBarHeight = 100;

  const getBarColor = (occupancy, isNow) => {
    if (isNow) return COLORS.accent;
    if (occupancy >= 0.9) return COLORS.availLow;
    if (occupancy >= 0.6) return COLORS.availMed;
    return COLORS.availHigh;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Typical Occupancy</Text>
      <View style={styles.chart}>
        {peakHours.map((item) => {
          const isNow = item.hour === currentHour;
          const barHeight = Math.max(4, item.occupancy * maxBarHeight);
          const barColor = getBarColor(item.occupancy, isNow);
          const displayHour = item.hour > 12 ? item.hour - 12 : item.hour;
          const ampm = item.hour >= 12 ? 'p' : 'a';

          return (
            <View key={item.hour} style={styles.barCol}>
              <Text style={[styles.pctLabel, isNow && { color: COLORS.accent, fontWeight: '700' }]}>
                {Math.round(item.occupancy * 100)}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                      opacity: isNow ? 1 : 0.7,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.hourLabel, isNow && styles.hourLabelNow]}>
                {displayHour}{ampm}
              </Text>
              {isNow && <View style={styles.nowDot} />}
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.availHigh }]} />
          <Text style={styles.legendText}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.availMed }]} />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.availLow }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.legendText}>Now</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    ...FONTS.subheading,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  pctLabel: {
    fontSize: 8,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  bar: {
    width: '70%',
    minWidth: 6,
    maxWidth: 20,
    borderRadius: 3,
  },
  hourLabel: {
    fontSize: 8,
    color: COLORS.textLight,
    marginTop: 4,
  },
  hourLabelNow: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  nowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },
});
