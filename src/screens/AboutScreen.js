import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

const TEAM = [
  { name: 'Avery', role: 'Developer' },
  { name: 'Emily Anderson', role: 'Developer' },
  { name: 'Alexis', role: 'Developer' },
  { name: 'Valeria', role: 'Developer' },
  { name: 'Matthew Edelman', role: 'Developer' },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.iconWrap}>
          <Ionicons name="car-sport" size={40} color={COLORS.surface} />
        </View>
        <Text style={styles.appName}>GatorPark</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appDesc}>
          Find available parking at the University of Florida in real time.
        </Text>
      </View>

      {/* Mission */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flag-outline" size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Our Mission</Text>
        </View>
        <Text style={styles.cardText}>
          Many college students at the University of Florida have trouble finding parking spaces
          on campus. Some students spend hours searching for a spot or may be forced to park off
          campus. GatorPark gathers data on parking areas and shows how many spaces are available
          in real time, helping students save time and arrive on schedule.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="sparkles-outline" size={20} color={COLORS.accent} />
          <Text style={styles.cardTitle}>Key Features</Text>
        </View>
        <FeatureItem
          icon="map-outline"
          title="Interactive Map"
          desc="View all UF parking locations on a live campus map with your real-time position."
        />
        <FeatureItem
          icon="analytics-outline"
          title="Data Metrics"
          desc="See predicted availability with green/yellow/red indicators for quick visualization."
        />
        <FeatureItem
          icon="filter-outline"
          title="Smart Filtering"
          desc="Sort by permit type (Orange, Blue, Red, Green) or show only available spots."
        />
        <FeatureItem
          icon="notifications-outline"
          title="Alerts"
          desc="Get notified when spots open up at your preferred garage."
        />
      </View>

      {/* Team */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="people-outline" size={20} color="#7C3AED" />
          <Text style={styles.cardTitle}>The Team</Text>
        </View>
        {TEAM.map((member, i) => (
          <View key={i} style={styles.teamRow}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(i) }]}>
              <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
            </View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{member.role}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>University of Florida</Text>
        <Text style={styles.footerSub}>Go Gators! 🐊</Text>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.featureInfo}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function getAvatarColor(index) {
  const colors = [COLORS.primary, COLORS.accent, '#7C3AED', '#0891B2', '#16A34A'];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    ...FONTS.title,
    color: COLORS.primary,
  },
  appVersion: {
    ...FONTS.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  appDesc: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
    maxWidth: 280,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm + 4,
  },
  cardTitle: {
    ...FONTS.subheading,
    color: COLORS.text,
  },
  cardText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },

  featureRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm + 4,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    ...FONTS.subheading,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 2,
  },
  featureDesc: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },

  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceAlt,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm + 4,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    ...FONTS.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  teamRole: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },

  footer: {
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  footerText: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  footerSub: {
    ...FONTS.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
