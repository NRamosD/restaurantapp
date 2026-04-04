import { Stack } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
