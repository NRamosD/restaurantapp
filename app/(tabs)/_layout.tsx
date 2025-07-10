import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 80,
            paddingBottom: 12,
          },
          default: {
            height: 80,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="house.fill" color={color} />,
          tabBarLabelStyle: {
            fontSize:20
          }
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="archivebox.fill" color={color} />,
          tabBarLabelStyle: {
            fontSize:20
          }
        }}
      />
      <Tabs.Screen
        name="dishes"
        options={{
          title: 'Menú',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="list.clipboard" color={color} />,
          tabBarLabelStyle: {
            fontSize:20
          }
        }}
      />
    </Tabs>
  );
}
