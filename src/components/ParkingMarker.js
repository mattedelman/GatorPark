import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAvailabilityColor } from '../utils/parking';

const W = 100;
const BODY_H = 50;
const ARROW_H = 8;
const H = BODY_H + ARROW_H;

const LIGHT_BG = {
  '#22C55E': '#DCFCE7',
  '#F59E0B': '#FEF3C7',
  '#EF4444': '#FEE2E2',
  '#6B7280': '#F3F4F6',
};

export default function ParkingMarker({ garage }) {
  const color = getAvailabilityColor(garage.availableSpaces, garage.totalSpaces);
  const isFull = garage.availableSpaces <= 0;
  const bg = LIGHT_BG[color] || '#F3F4F6';

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: bg }]}>
          <Ionicons name="car" size={18} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{garage.shortName}</Text>
          <Text style={[styles.count, { color }]}>
            {isFull ? 'Full' : garage.availableSpaces + ' spots'}
          </Text>
        </View>
      </View>
      <View style={styles.arrowWrap}>
        <View style={styles.arrow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: W,
    height: H,
    alignItems: 'center',
  },
  card: {
    width: W,
    height: BODY_H,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    elevation: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginLeft: 6,
    flex: 1,
  },
  name: {
    color: '#1A1A2E',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  count: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
    marginTop: 1,
  },
  arrowWrap: {
    width: 16,
    height: ARROW_H,
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    marginTop: -6,
    elevation: 8,
  },
});
