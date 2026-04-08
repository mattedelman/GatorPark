import { COLORS } from '../constants/theme';

export function getAvailabilityColor(available, total) {
  const ratio = available / total;
  if (ratio <= 0) return COLORS.availNone;
  if (ratio < 0.1) return COLORS.availLow;
  if (ratio < 0.35) return COLORS.availMed;
  return COLORS.availHigh;
}

export function getAvailabilityLabel(available, total) {
  const ratio = available / total;
  if (ratio <= 0) return 'Full';
  if (ratio < 0.1) return 'Almost Full';
  if (ratio < 0.35) return 'Filling Up';
  return 'Available';
}

export function formatOccupancyPercent(occupancy) {
  return `${Math.round(occupancy * 100)}%`;
}

export function getCurrentHourOccupancy(peakHours) {
  const currentHour = new Date().getHours();
  const match = peakHours.find((p) => p.hour === currentHour);
  if (match) return match.occupancy;
  if (currentHour < 7) return 0.05;
  if (currentHour > 20) return 0.08;
  return 0.5;
}

export function simulateAvailabilityChange(garage) {
  const jitter = Math.floor(Math.random() * 11) - 5;
  const newAvailable = Math.max(0, Math.min(garage.totalSpaces, garage.availableSpaces + jitter));
  return { ...garage, availableSpaces: newAvailable };
}
