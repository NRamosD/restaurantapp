import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAppTheme } from '@/theme';

export default function TabLayout() {
  const theme = useAppTheme();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.components.tabBar.activeTintColor,
        tabBarInactiveTintColor: theme.components.tabBar.inactiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 80,
            paddingBottom: 12,
            backgroundColor: theme.components.tabBar.backgroundColor,
          },
          default: {
            height: 80,
            backgroundColor: theme.components.tabBar.backgroundColor,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="house.fill" color={color} />,
          tabBarLabelStyle: { fontSize: 20 },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Ventas',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="archivebox.fill" color={color} />,
          tabBarLabelStyle: { fontSize: 20 },
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="list.clipboard" color={color} />,
          tabBarLabelStyle: { fontSize: 20 },
        }}
      />
    </Tabs>
  );
}
