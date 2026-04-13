import React from 'react';
import {
  Platform,
  ActivityIndicator,
  View,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import GarageDetailScreen from './src/screens/GarageDetailScreen';
import FilterScreen from './src/screens/FilterScreen';
import AboutScreen from './src/screens/AboutScreen';
import { COLORS } from './src/constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMap" component={HomeScreen} />
      <Stack.Screen
        name="GarageDetail"
        component={GarageDetailScreen}
        options={{ presentation: 'card', gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
}

function FilterStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FilterMain" component={FilterScreen} />
      <Stack.Screen
        name="GarageDetail"
        component={GarageDetailScreen}
        options={{ presentation: 'card', gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  Home: { active: 'map', inactive: 'map-outline' },
  Filter: { active: 'filter', inactive: 'filter-outline' },
  About: { active: 'information-circle', inactive: 'information-circle-outline' },
};

/** Padding above system gesture / home indicator so labels are not tight to the edge. */
const TAB_BAR_EXTRA_BOTTOM = 14;
const TAB_BAR_TOP_PAD = 6;
const TAB_BAR_ROW_HEIGHT = 50;

const WEB_FRAME_BG = '#E8ECF2';

function WebShell({ children }) {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') {
    return children;
  }
  const wide = width >= 500;
  return (
    <View
      style={[
        styles.webOuter,
        wide ? styles.webOuterWide : styles.webOuterNarrow,
      ]}
    >
      <View
        style={[
          styles.webInner,
          wide ? styles.webInnerWide : styles.webInnerNarrow,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    backgroundColor: WEB_FRAME_BG,
    alignItems: 'center',
  },
  webOuterWide: {
    paddingVertical: 20,
    justifyContent: 'center',
  },
  webOuterNarrow: {
    justifyContent: 'flex-start',
  },
  webInner: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  webInnerWide: {
    maxHeight: 'calc(100vh - 40px)',
    borderRadius: 24,
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.12)',
  },
  webInnerNarrow: {
    maxHeight: '100vh',
  },
});

function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + TAB_BAR_EXTRA_BOTTOM;
  const tabBarHeight =
    TAB_BAR_TOP_PAD + TAB_BAR_ROW_HEIGHT + bottomPad;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={22}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          paddingTop: TAB_BAR_TOP_PAD,
          paddingBottom: bottomPad,
          height: tabBarHeight,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Map' }}
      />
      <Tab.Screen
        name="Filter"
        component={FilterStack}
        options={{ tabBarLabel: 'Filter' }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{ tabBarLabel: 'About' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return (
      <WebShell>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </WebShell>
    );
  }

  return (
    <WebShell>
      <SafeAreaProvider>
      <NavigationContainer
        {...(Platform.OS === 'web'
          ? {
              documentTitle: {
                formatter: () => 'GatorPark',
              },
            }
          : {})}
      >
        <MainTabs />
      </NavigationContainer>
    </SafeAreaProvider>
    </WebShell>
  );
}
