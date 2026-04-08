import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { PERMIT_TYPES } from '../constants/parkingData';
import {
  getAvailabilityColor,
  getAvailabilityLabel,
  simulateAvailabilityChange,
} from '../utils/parking';
import AvailabilityBadge from '../components/AvailabilityBadge';
import OccupancyChart from '../components/OccupancyChart';

export default function GarageDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const [garage, setGarage] = useState(route.params.garage);
  const color = getAvailabilityColor(garage.availableSpaces, garage.totalSpaces);
  const pctFree = Math.round((garage.availableSpaces / garage.totalSpaces) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setGarage((prev) => simulateAvailabilityChange(prev));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const openDirections = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${garage.latitude},${garage.longitude}`,
      android: `geo:${garage.latitude},${garage.longitude}?q=${garage.latitude},${garage.longitude}(${garage.name})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const permitDetails = PERMIT_TYPES.filter(
    (p) => garage.permits.includes(p.id) && p.id !== 'all'
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={[styles.heroCard, { borderLeftColor: color }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{garage.name}</Text>
              <AvailabilityBadge available={garage.availableSpaces} total={garage.totalSpaces} />
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatBlock}>
              <Text style={[styles.heroStatNum, { color }]}>{garage.availableSpaces}</Text>
              <Text style={styles.heroStatLabel}>Available</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatBlock}>
              <Text style={[styles.heroStatNum, { color: COLORS.text }]}>{garage.totalSpaces}</Text>
              <Text style={styles.heroStatLabel}>Total</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatBlock}>
              <Text style={[styles.heroStatNum, { color }]}>{pctFree}%</Text>
              <Text style={styles.heroStatLabel}>Free</Text>
            </View>
          </View>

          {/* Capacity bar */}
          <View style={styles.capacityBarWrap}>
            <View style={styles.capacityBarBg}>
              <View style={[styles.capacityBarFill, { width: `${100 - pctFree}%`, backgroundColor: color }]} />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={openDirections}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="navigate" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.accent + '15' }]}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.actionText}>Alert Me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#7C3AED15' }]}>
              <Ionicons name="share-outline" size={20} color="#7C3AED" />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Occupancy Chart */}
        <OccupancyChart peakHours={garage.peakHours} />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Details</Text>
          <InfoRow icon="location-outline" label="Address" value={garage.address} />
          <InfoRow icon="time-outline" label="Hours" value={garage.hours} />
          <InfoRow
            icon="layers-outline"
            label="Type"
            value={garage.floors > 1 ? `Parking Garage · ${garage.floors} floors` : 'Surface Lot'}
          />
          {garage.hourlyRate > 0 && (
            <>
              <InfoRow icon="cash-outline" label="Hourly Rate" value={`$${garage.hourlyRate.toFixed(2)}/hr`} />
              <InfoRow icon="card-outline" label="Max Daily" value={`$${garage.maxDailyRate.toFixed(2)}`} />
            </>
          )}
          {garage.hourlyRate === 0 && (
            <InfoRow icon="cash-outline" label="Cost" value="Free with permit" />
          )}
        </View>

        {/* Permits */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Accepted Permits</Text>
          <View style={styles.permitsGrid}>
            {permitDetails.map((permit) => (
              <View key={permit.id} style={[styles.permitBadge, { borderColor: permit.color + '40' }]}>
                <View style={[styles.permitDot, { backgroundColor: permit.color }]} />
                <Text style={[styles.permitLabel, { color: permit.color }]}>{permit.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.accent} />
            <Text style={styles.tipsTitle}>Parking Tip</Text>
          </View>
          <Text style={styles.tipsText}>
            {garage.availableSpaces < 50
              ? 'This garage is nearly full. Consider checking nearby alternatives or arriving during off-peak hours (before 9 AM or after 4 PM).'
              : 'Good availability! Weekday mornings tend to fill up fastest. Best times are early morning or late afternoon.'}
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.fixedTitle} numberOfLines={1}>{garage.shortName}</Text>
        <View style={[styles.liveBadge, { backgroundColor: color + '20' }]}>
          <View style={[styles.liveBadgeDot, { backgroundColor: color }]} />
          <Text style={[styles.liveBadgeText, { color }]}>{garage.availableSpaces}</Text>
        </View>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.textSecondary} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedTitle: {
    ...FONTS.subheading,
    color: COLORS.text,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  liveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  liveBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },

  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 100,
    paddingHorizontal: SPACING.md,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    ...FONTS.heading,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  heroStatBlock: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatNum: {
    fontSize: 26,
    fontWeight: '900',
  },
  heroStatLabel: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  capacityBarWrap: {
    marginTop: SPACING.md,
  },
  capacityBarBg: {
    height: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: 8,
    borderRadius: 4,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...FONTS.subheading,
    color: COLORS.text,
    marginBottom: SPACING.sm + 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceAlt,
  },
  infoIcon: {
    marginRight: SPACING.sm + 2,
  },
  infoLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    width: 90,
  },
  infoValue: {
    ...FONTS.body,
    color: COLORS.text,
    flex: 1,
    fontWeight: '600',
    textAlign: 'right',
  },

  permitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  permitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  permitLabel: {
    ...FONTS.caption,
    fontWeight: '700',
  },

  tipsCard: {
    backgroundColor: COLORS.accent + '0A',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent + '20',
    marginBottom: SPACING.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 6,
  },
  tipsTitle: {
    ...FONTS.subheading,
    color: COLORS.accent,
    fontSize: 14,
  },
  tipsText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
