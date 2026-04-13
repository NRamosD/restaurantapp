import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useAppearanceStore, type AppThemePreset } from '@/hooks/useAppearanceStore';

export function useColorScheme(): AppThemePreset {
  const nativeScheme = useNativeColorScheme();
  const themePreset = useAppearanceStore((state) => state.themePreset);

  if (themePreset === 'light' || themePreset === 'dark' || themePreset === 'sunset' || themePreset === 'greenland') {
    return themePreset;
  }

  return nativeScheme === 'dark' ? 'dark' : 'light';
}
