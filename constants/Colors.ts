import { appThemes, getLegacyColors, type LegacyThemeColors, type AppThemeMode } from '@/theme';

type ColorSchemeName = AppThemeMode | 'unspecified' | null;

export const Colors: Record<AppThemeMode, LegacyThemeColors> = {
  light: getLegacyColors('light'),
  dark: getLegacyColors('dark'),
  sunset: getLegacyColors('sunset'),
  greenland: getLegacyColors('greenland'),
};

export function getColors(scheme: ColorSchemeName): LegacyThemeColors {
  if (scheme === 'dark' || scheme === 'light' || scheme === 'sunset' || scheme === 'greenland') {
    return getLegacyColors(scheme);
  }

  return getLegacyColors('light');
}

export { appThemes };
