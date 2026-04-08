# GatorPark 🐊🅿️

**Find available parking at the University of Florida — in real time.**

Built by: Avery, Emily Anderson, Alexis, Valeria, Matthew Edelman

---

## Problem

Many UF students spend significant time searching for parking on campus. GatorPark displays real-time parking availability across campus garages and lots so you can find a spot faster and get to class on time.

## Features

- **Interactive Campus Map** — Live map of UF showing all parking garages/lots with your real-time GPS position
- **Color-Coded Availability** — Green (plenty), yellow (filling up), red (almost full) indicators at a glance
- **Permit Filtering** — Filter by Orange, Blue, Red, Green, Park & Ride, Visitor, or Disabled permits
- **Garage Details** — Tap any location for floor count, hours, pricing, accepted permits, and a typical-occupancy chart
- **Live Updates** — Availability numbers refresh automatically every 8 seconds
- **Sort & Filter Screen** — Sort by most spots, % free, or name; toggle to hide full locations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 53) |
| Navigation | React Navigation (Bottom Tabs + Stack) |
| Map | `react-native-maps` |
| Icons | `@expo/vector-icons` (Ionicons) |
| Location | `expo-location` |

## Getting Started

```bash
# 1. Install dependencies
cd GatorPark
npm install

# 2. Start the Expo dev server
npx expo start

# 3. Run on a device / simulator
#    Press 'a' for Android, 'i' for iOS, or 'w' for web
```

## Project Structure

```
GatorPark/
├── App.js                          # Root: navigation + tab bar
├── src/
│   ├── constants/
│   │   ├── theme.js                # UF colors, fonts, spacing
│   │   └── parkingData.js          # Mock garage data + permit types
│   ├── utils/
│   │   └── parking.js              # Availability helpers
│   ├── components/
│   │   ├── AvailabilityBadge.js    # Green/yellow/red status pill
│   │   ├── GarageCard.js           # List card for a garage
│   │   ├── ParkingMarker.js        # Custom map pin
│   │   ├── FilterChip.js           # Selectable filter pill
│   │   └── OccupancyChart.js       # Hourly bar chart
│   └── screens/
│       ├── HomeScreen.js           # Map + bottom sheet list
│       ├── GarageDetailScreen.js   # Full detail view per garage
│       ├── FilterScreen.js         # Filter & sort UI
│       └── AboutScreen.js          # Team & app info
└── package.json
```

## Screens

| Screen | Description |
|--------|-------------|
| **Map (Home)** | Interactive map with colored markers showing spot counts. Pull-up bottom sheet lists all garages with real-time availability bars. Horizontal permit filter chips. |
| **Filter** | Full-screen filter & sort: pick permit types, toggle "available only", sort by spots/percentage/name. |
| **Garage Detail** | Hero card with live count, capacity bar, quick-action buttons (Directions, Alert Me, Share), hourly occupancy chart, info rows, accepted permits grid, and contextual tips. |
| **About** | App info, mission statement, feature highlights, and team credits. |

## Roadmap

- [ ] Real sensor/meter data integration (garage counters, IoT sensors)
- [ ] Push notifications when a favorite garage drops below threshold
- [ ] Historical trends and ML-based predictions
- [ ] Game-day / event mode with temporary lot support
- [ ] User accounts with saved preferences

## License

University of Florida — Student Project
