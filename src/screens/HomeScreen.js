import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { GARAGES, UF_CAMPUS_REGION, PERMIT_TYPES } from '../constants/parkingData';
import { simulateAvailabilityChange } from '../utils/parking';
import GarageCard from '../components/GarageCard';
import CampusMap from '../components/CampusMap';
import FilterChip from '../components/FilterChip';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 72;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.65;

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [garages, setGarages] = useState(GARAGES);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [listExpanded, setListExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('hybrid');
  const listHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGarages((prev) => prev.map(simulateAvailabilityChange));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredGarages = selectedFilter === 'all'
    ? garages
    : garages.filter((g) => g.permits.includes(selectedFilter));

  const totalAvailable = filteredGarages.reduce((sum, g) => sum + g.availableSpaces, 0);
  const totalSpaces = filteredGarages.reduce((sum, g) => sum + g.totalSpaces, 0);

  const toggleList = useCallback(() => {
    const toValue = listExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
    Animated.spring(listHeight, {
      toValue,
      friction: 12,
      tension: 50,
      useNativeDriver: false,
    }).start();
    setListExpanded((prev) => !prev);
  }, [listExpanded, listHeight]);

  const focusGarage = useCallback((garage) => {
    mapRef.current?.animateToRegion({
      latitude: garage.latitude,
      longitude: garage.longitude,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    }, 600);
  }, []);

  const handleMarkerPress = useCallback((garage) => {
    navigation.navigate('GarageDetail', { garage });
  }, [navigation]);

  const renderGarageItem = useCallback(({ item }) => (
    <GarageCard
      garage={item}
      onPress={() => {
        focusGarage(item);
        navigation.navigate('GarageDetail', { garage: item });
      }}
    />
  ), [focusGarage, navigation]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <CampusMap
        mapRef={mapRef}
        region={UF_CAMPUS_REGION}
        garages={filteredGarages}
        onMarkerPress={handleMarkerPress}
        style={styles.map}
      />

      {/* Top Header Overlay */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <View style={styles.headerContent}>
          <View>
            <View style={styles.logoRow}>
              <Ionicons name="car-sport" size={24} color={COLORS.accent} />
              <Text style={styles.logoText}>GatorPark</Text>
            </View>
            <Text style={styles.subtitle}>University of Florida</Text>
          </View>
          <View style={styles.liveWrap}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{totalAvailable}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{filteredGarages.length}</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{Math.round((totalAvailable / totalSpaces) * 100)}%</Text>
            <Text style={styles.statLabel}>Free</Text>
          </View>
        </View>
      </View>

      {/* Map controls */}
      <View style={[styles.mapControls, { top: insets.top + 140 }]}>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => mapRef.current?.animateToRegion(UF_CAMPUS_REGION, 500)}
        >
          <Ionicons name="locate-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.sheet, { height: listHeight }]}>
        {/* Drag Handle */}
        <TouchableOpacity style={styles.handleArea} onPress={toggleList} activeOpacity={0.8}>
          <View style={styles.handle} />
          <View style={styles.sheetHeaderRow}>
            <Text style={styles.sheetTitle}>Parking Spots</Text>
            <Ionicons
              name={listExpanded ? 'chevron-down' : 'chevron-up'}
              size={20}
              color={COLORS.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {listExpanded && (
          <>
            {/* Filter Chips */}
            <View style={styles.filterWrap}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={PERMIT_TYPES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.filterList}
                renderItem={({ item }) => (
                  <FilterChip
                    label={item.label}
                    color={item.color}
                    selected={selectedFilter === item.id}
                    onPress={() => setSelectedFilter(item.id)}
                  />
                )}
              />
            </View>

            {/* Garage List */}
            <FlatList
              data={filteredGarages}
              keyExtractor={keyExtractor}
              renderItem={renderGarageItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Ionicons name="alert-circle-outline" size={40} color={COLORS.textLight} />
                  <Text style={styles.emptyText}>No garages match this filter</Text>
                </View>
              }
            />
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    ...FONTS.heading,
    color: COLORS.primary,
    fontSize: 22,
  },
  subtitle: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginTop: 1,
    marginLeft: 32,
  },
  liveWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.availHigh,
    marginRight: 5,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.availHigh,
    letterSpacing: 1,
  },

  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },

  mapControls: {
    position: 'absolute',
    right: SPACING.md,
  },
  mapBtn: {
    backgroundColor: COLORS.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sheetTitle: {
    ...FONTS.heading,
    color: COLORS.text,
  },

  filterWrap: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  filterList: {
    paddingHorizontal: SPACING.md,
  },

  listContent: {
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.xs,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
});
