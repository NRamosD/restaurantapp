import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { type AppThemePreset } from '@/hooks/useAppearanceStore';

export type AppThemeMode = AppThemePreset;

export interface AppTheme {
  mode: AppThemeMode;
  colors: {
    text: {
      primary: string;
      secondary: string;
      inverse: string;
      link: string;
    };
    surface: {
      background: string;
      card: string;
      cardGradientStart: string;
      cardGradientEnd: string;
      muted: string;
    };
    border: {
      default: string;
      active: string;
      muted: string;
    };
    brand: {
      primary: string;
      onPrimary: string;
    };
    feedback: {
      success: string;
      warning: string;
      error: string;
    };
    icon: {
      primary: string;
      muted: string;
    };
    input: {
      background: string;
      text: string;
      placeholder: string;
      border: string;
      borderActive: string;
      disabled: string;
    };
    disabled: string;
    shimmer: {
      start: string;
      end: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  components: {
    button: {
      primary: {
        backgroundColor: string;
        textColor: string;
        borderColor: string;
      };
      secondary: {
        backgroundColor: string;
        textColor: string;
        borderColor: string;
      };
      ghost: {
        backgroundColor: string;
        textColor: string;
        borderColor: string;
      };
      danger: {
        backgroundColor: string;
        textColor: string;
        borderColor: string;
      };
    };
    input: {
      backgroundColor: string;
      textColor: string;
      labelColor: string;
      placeholderColor: string;
      borderColor: string;
      activeBorderColor: string;
      disabledColor: string;
    };
    card: {
      backgroundColor: string;
      borderColor: string;
    };
    tabBar: {
      activeTintColor: string;
      inactiveTintColor: string;
      backgroundColor: string;
    };
  };
}

const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

const baseRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
};

const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    text: {
      primary: '#1A1A1A',
      secondary: '#424242',
      inverse: '#FFFFFF',
      link: '#0a7ea4',
    },
    surface: {
      background: '#F5F7FA',
      card: '#FFFFFF',
      cardGradientStart: '#FFFFFF',
      cardGradientEnd: '#F8FAFC',
      muted: '#EEF2F6',
    },
    border: {
      default: '#B0BEC5',
      active: '#02dbb7',
      muted: '#E0E5EB',
    },
    brand: {
      primary: '#02dbb7',
      onPrimary: '#1A1A1A',
    },
    feedback: {
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
    },
    icon: {
      primary: '#1A1A1A',
      muted: '#6B7280',
    },
    input: {
      background: '#FFFFFF',
      text: '#1A1A1A',
      placeholder: '#6B7280',
      border: '#E0E5EB',
      borderActive: '#02dbb7',
      disabled: '#B0BEC5',
    },
    disabled: '#B0BEC5',
    shimmer: {
      start: '#E8EDF3',
      end: '#F5F7FA',
    },
  },
  spacing: baseSpacing,
  radius: baseRadius,
  components: {
    button: {
      primary: {
        backgroundColor: '#02dbb7',
        textColor: '#1A1A1A',
        borderColor: '#02dbb7',
      },
      secondary: {
        backgroundColor: '#FFFFFF',
        textColor: '#1A1A1A',
        borderColor: '#B0BEC5',
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: '#1A1A1A',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: '#DC2626',
        textColor: '#FFFFFF',
        borderColor: '#DC2626',
      },
    },
    input: {
      backgroundColor: '#FFFFFF',
      textColor: '#1A1A1A',
      labelColor: '#424242',
      placeholderColor: '#6B7280',
      borderColor: '#E0E5EB',
      activeBorderColor: '#02dbb7',
      disabledColor: '#B0BEC5',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderColor: '#B0BEC5',
    },
    tabBar: {
      activeTintColor: '#02dbb7',
      inactiveTintColor: '#6B7280',
      backgroundColor: '#FFFFFF',
    },
  },
};

const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
      inverse: '#1A1A1A',
      link: '#67E8F9',
    },
    surface: {
      background: '#1A1A2E',
      card: '#252538',
      cardGradientStart: '#2D2D44',
      cardGradientEnd: '#1F1F35',
      muted: '#202034',
    },
    border: {
      default: '#4A4A6A',
      active: '#02dbb7',
      muted: '#3D3D5C',
    },
    brand: {
      primary: '#02dbb7',
      onPrimary: '#1A1A1A',
    },
    feedback: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#F87171',
    },
    icon: {
      primary: '#FFFFFF',
      muted: '#9CA3AF',
    },
    input: {
      background: '#252538',
      text: '#FFFFFF',
      placeholder: '#9CA3AF',
      border: '#3D3D5C',
      borderActive: '#02dbb7',
      disabled: '#4A4A6A',
    },
    disabled: '#4A4A6A',
    shimmer: {
      start: '#3D3D5C',
      end: '#252538',
    },
  },
  spacing: baseSpacing,
  radius: baseRadius,
  components: {
    button: {
      primary: {
        backgroundColor: '#02dbb7',
        textColor: '#1A1A1A',
        borderColor: '#02dbb7',
      },
      secondary: {
        backgroundColor: '#252538',
        textColor: '#FFFFFF',
        borderColor: '#4A4A6A',
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: '#FFFFFF',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: '#F87171',
        textColor: '#1A1A1A',
        borderColor: '#F87171',
      },
    },
    input: {
      backgroundColor: '#252538',
      textColor: '#FFFFFF',
      labelColor: '#B0BEC5',
      placeholderColor: '#9CA3AF',
      borderColor: '#3D3D5C',
      activeBorderColor: '#02dbb7',
      disabledColor: '#4A4A6A',
    },
    card: {
      backgroundColor: '#252538',
      borderColor: '#4A4A6A',
    },
    tabBar: {
      activeTintColor: '#02dbb7',
      inactiveTintColor: '#9CA3AF',
      backgroundColor: '#252538',
    },
  },
};

const sunsetTheme: AppTheme = {
  mode: 'sunset',
  colors: {
    text: {
      primary: '#5F2E22',
      secondary: '#7A4A36',
      inverse: '#FFFFFF',
      link: '#FF9A86',
    },
    surface: {
      background: '#FFF0BE',
      card: '#FFF7D6',
      cardGradientStart: '#FFD6A6',
      cardGradientEnd: '#FFF0BE',
      muted: '#FFE6BE',
    },
    border: {
      default: '#FFB399',
      active: '#FF9A86',
      muted: '#FFD6A6',
    },
    brand: {
      primary: '#FF9A86',
      onPrimary: '#5F2E22',
    },
    feedback: {
      success: '#7C9D5D',
      warning: '#C97A42',
      error: '#C75454',
    },
    icon: {
      primary: '#5F2E22',
      muted: '#A56C56',
    },
    input: {
      background: '#FFF7D6',
      text: '#5F2E22',
      placeholder: '#A56C56',
      border: '#FFB399',
      borderActive: '#FF9A86',
      disabled: '#E7C8B5',
    },
    disabled: '#E7C8B5',
    shimmer: {
      start: '#FFE1C6',
      end: '#FFF0BE',
    },
  },
  spacing: baseSpacing,
  radius: baseRadius,
  components: {
    button: {
      primary: {
        backgroundColor: '#FF9A86',
        textColor: '#5F2E22',
        borderColor: '#FF9A86',
      },
      secondary: {
        backgroundColor: '#FFF7D6',
        textColor: '#5F2E22',
        borderColor: '#FFB399',
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: '#5F2E22',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: '#C75454',
        textColor: '#FFFFFF',
        borderColor: '#C75454',
      },
    },
    input: {
      backgroundColor: '#FFF7D6',
      textColor: '#5F2E22',
      labelColor: '#7A4A36',
      placeholderColor: '#A56C56',
      borderColor: '#FFB399',
      activeBorderColor: '#FF9A86',
      disabledColor: '#E7C8B5',
    },
    card: {
      backgroundColor: '#FFF7D6',
      borderColor: '#FFB399',
    },
    tabBar: {
      activeTintColor: '#FF9A86',
      inactiveTintColor: '#A56C56',
      backgroundColor: '#FFF7D6',
    },
  },
};

const greenlandTheme: AppTheme = {
  mode: 'greenland',
  colors: {
    text: {
      primary: '#17361D',
      secondary: '#346739',
      inverse: '#FFFFFF',
      link: '#346739',
    },
    surface: {
      background: '#F2EDC2',
      card: '#FCF8DA',
      cardGradientStart: '#9FCB98',
      cardGradientEnd: '#F2EDC2',
      muted: '#E4E8BF',
    },
    border: {
      default: '#79AE6F',
      active: '#346739',
      muted: '#9FCB98',
    },
    brand: {
      primary: '#346739',
      onPrimary: '#FFFFFF',
    },
    feedback: {
      success: '#346739',
      warning: '#9A7B2F',
      error: '#B44A4A',
    },
    icon: {
      primary: '#17361D',
      muted: '#5F8C57',
    },
    input: {
      background: '#FCF8DA',
      text: '#17361D',
      placeholder: '#5F8C57',
      border: '#79AE6F',
      borderActive: '#346739',
      disabled: '#B7C7A1',
    },
    disabled: '#B7C7A1',
    shimmer: {
      start: '#DDE8C1',
      end: '#F2EDC2',
    },
  },
  spacing: baseSpacing,
  radius: baseRadius,
  components: {
    button: {
      primary: {
        backgroundColor: '#346739',
        textColor: '#FFFFFF',
        borderColor: '#346739',
      },
      secondary: {
        backgroundColor: '#FCF8DA',
        textColor: '#17361D',
        borderColor: '#79AE6F',
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: '#17361D',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: '#B44A4A',
        textColor: '#FFFFFF',
        borderColor: '#B44A4A',
      },
    },
    input: {
      backgroundColor: '#FCF8DA',
      textColor: '#17361D',
      labelColor: '#346739',
      placeholderColor: '#5F8C57',
      borderColor: '#79AE6F',
      activeBorderColor: '#346739',
      disabledColor: '#B7C7A1',
    },
    card: {
      backgroundColor: '#FCF8DA',
      borderColor: '#79AE6F',
    },
    tabBar: {
      activeTintColor: '#346739',
      inactiveTintColor: '#5F8C57',
      backgroundColor: '#FCF8DA',
    },
  },
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
  sunset: sunsetTheme,
  greenland: greenlandTheme,
} satisfies Record<AppThemeMode, AppTheme>;

export type AppThemeColorKey =
  | 'text'
  | 'secondaryText'
  | 'background'
  | 'tint'
  | 'card'
  | 'cardGradientStart'
  | 'cardGradientEnd'
  | 'border'
  | 'disabled'
  | 'inputBorder'
  | 'inputBorderActive'
  | 'inputIcon'
  | 'shimmerStart'
  | 'shimmerEnd'
  | 'icon';

export type LegacyThemeColors = Record<AppThemeColorKey, string>;

export function resolveThemeMode(
  scheme: ReturnType<typeof useColorScheme>
): AppThemeMode {
  return scheme;
}

export function getAppTheme(
  scheme: ReturnType<typeof useColorScheme>
): AppTheme {
  return appThemes[resolveThemeMode(scheme)];
}

export function getLegacyColors(
  scheme: ReturnType<typeof useColorScheme>
): LegacyThemeColors {
  const theme = getAppTheme(scheme);

  return {
    text: theme.colors.text.primary,
    secondaryText: theme.colors.text.secondary,
    background: theme.colors.surface.background,
    tint: theme.colors.brand.primary,
    card: theme.colors.surface.card,
    cardGradientStart: theme.colors.surface.cardGradientStart,
    cardGradientEnd: theme.colors.surface.cardGradientEnd,
    border: theme.colors.border.default,
    disabled: theme.colors.disabled,
    inputBorder: theme.colors.input.border,
    inputBorderActive: theme.colors.input.borderActive,
    inputIcon: theme.colors.icon.muted,
    shimmerStart: theme.colors.shimmer.start,
    shimmerEnd: theme.colors.shimmer.end,
    icon: theme.colors.icon.primary,
  };
}

export function getNavigationTheme(
  scheme: ReturnType<typeof useColorScheme>
): NavigationTheme {
  const mode = resolveThemeMode(scheme);
  const theme = getAppTheme(mode);
  const base = mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.brand.primary,
      background: theme.colors.surface.background,
      card: theme.colors.surface.card,
      text: theme.colors.text.primary,
      border: theme.colors.border.default,
      notification: theme.colors.feedback.error,
    },
  };
}

export function getPaperTheme(
  scheme: ReturnType<typeof useColorScheme>
): MD3Theme {
  const mode = resolveThemeMode(scheme);
  const theme = getAppTheme(mode);
  const base = mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    roundness: theme.radius.md,
    colors: {
      ...base.colors,
      primary: theme.colors.brand.primary,
      onPrimary: theme.colors.brand.onPrimary,
      background: theme.colors.surface.background,
      surface: theme.colors.surface.card,
      surfaceVariant: theme.colors.surface.muted,
      onSurface: theme.colors.text.primary,
      onSurfaceVariant: theme.colors.text.secondary,
      outline: theme.colors.border.default,
      outlineVariant: theme.colors.border.muted,
      error: theme.colors.feedback.error,
      onError: theme.colors.text.inverse,
    },
  };
}

export function useAppTheme() {
  const scheme = useColorScheme();

  return getAppTheme(scheme);
}
