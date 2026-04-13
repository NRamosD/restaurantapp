/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { getLegacyColors, resolveThemeMode } from '@/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = resolveThemeMode(useColorScheme());
  const colorFromProps = theme === 'dark' ? props.dark : props.light;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return getLegacyColors(theme)[colorName];
  }
}
