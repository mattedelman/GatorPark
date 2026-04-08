import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { GARAGES, PERMIT_TYPES } from '../constants/parkingData';
import { getAvailabilityColor } from '../utils/parking';
import GarageCard from '../components/GarageCard';

export default function FilterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPermits, setSelectedPermits] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('availability');

  const togglePermit = useCallback((id) => {
    setSelectedPermits((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const filteredGarages = useMemo(() => {
    let result = [...GARAGES];

    if (selectedPermits.length > 0) {
      result = result.filter((g) =>
        selectedPermits.some((p) => g.permits.includes(p))
      );
    }

    if (showAvailableOnly) {
      result = result.filter((g) => g.availableSpaces > 0);
    }

    if (sortBy === 'availability') {
      result.sort((a, b) => b.availableSpaces - a.availableSpaces);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'percentage') {
      result.sort(
        (a, b) =>
          b.availableSpaces / b.totalSpaces - a.availableSpaces / a.totalSpaces
      );
    }

    return result;
  }, [selectedPermits, showAvailableOnly, sortBy]);

  const sortOptions = [
    { id: 'availability', label: 'Most Spots', icon: 'car-outline' },
    { id: 'percentage', label: '% Free', icon: 'pie-chart-outline' },
    { id: 'name', label: 'Name', icon: 'text-outline' },
  ];

  const permitOptions = PERMIT_TYPES.filter((p) => p.id !== 'all');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Filter & Sort</Text>
        {selectedPermits.length > 0 && (
          <TouchableOpacity onPress={() => setSelectedPermits([])}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredGarages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Sort Options */}
            <Text style={styles.sectionLabel}>Sort By</Text>
            <View style={styles.sortRow}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortChip,
                    sortBy === option.id && styles.sortChipActive,
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Ionicons
                    name={option.icon}
                    size={16}
                    color={sortBy === option.id ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.sortLabel,
                      sortBy === option.id && styles.sortLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Permit Filter */}
            <Text style={styles.sectionLabel}>Permit Type</Text>
            <View style={styles.permitsWrap}>
              {permitOptions.map((permit) => {
                const active = selectedPermits.includes(permit.id);
                return (
                  <TouchableOpacity
                    key={permit.id}
                    style={[
                      styles.permitChip,
                      active && {
                        backgroundColor: permit.color + '18',
                        borderColor: permit.color,
                      },
                    ]}
                    onPress={() => togglePermit(permit.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.permitDot,
                        { backgroundColor: permit.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.permitLabel,
                        active && { color: permit.color, fontWeight: '700' },
                      ]}
                    >
                      {permit.label}
                    </Text>
                    {active && (
                      <Ionicons name="checkmark" size={14} color={permit.color} style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Ionicons name="eye-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.toggleLabel}>Show available only</Text>
              </View>
              <Switch
                value={showAvailableOnly}
                onValueChange={setShowAvailableOnly}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
                thumbColor={showAvailableOnly ? COLORS.primary : '#f4f4f4'}
              />
            </View>

            {/* Results Count */}
            <View style={styles.resultsRow}>
              <Text style={styles.resultsText}>
                {filteredGarages.length} result{filteredGarages.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.resultsSub}>
                {filteredGarages.reduce((s, g) => s + g.availableSpaces, 0)} total spots available
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <GarageCard
            garage={item}
            onPress={() => navigation.navigate('GarageDetail', { garage: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters to see more results.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  title: {
    ...FONTS.title,
    color: COLORS.text,
    fontSize: 24,
  },
  clearText: {
    ...FONTS.caption,
    color: COLORS.accent,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: SPACING.xxl + 30,
  },

  sectionLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },

  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
  },
  sortChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '0D',
  },
  sortLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  sortLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  permitsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  permitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  permitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  permitLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    ...FONTS.body,
    color: COLORS.text,
    fontWeight: '500',
  },

  resultsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  resultsText: {
    ...FONTS.subheading,
    color: COLORS.text,
  },
  resultsSub: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    ...FONTS.heading,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});
