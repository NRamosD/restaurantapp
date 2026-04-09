import { appThemes, getLegacyColors, type LegacyThemeColors, type AppThemeMode } from '@/theme';

type ColorSchemeName = AppThemeMode | 'unspecified' | null;

export const Colors: Record<AppThemeMode, LegacyThemeColors> = {
  light: getLegacyColors('light'),
  dark: getLegacyColors('dark'),
};

export function getColors(scheme: ColorSchemeName): LegacyThemeColors {
  if (scheme === 'dark') {
    return getLegacyColors('dark');
  }

  return getLegacyColors('light');
}

export { appThemes };
