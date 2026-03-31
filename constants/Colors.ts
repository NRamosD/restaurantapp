const tintColorLight = '#02dbb7';
const tintColorDark = '#02dbb7';

export const Colors = {
  light: {
    text: '#1A1A1A',
    secondaryText: '#424242',
    background: '#F5F7FA',
    tint: tintColorLight,
    card: '#FFFFFF',
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F8FAFC',
    border: '#B0BEC5',
    disabled: '#B0BEC5',
    inputBorder: '#E0E5EB',
    inputBorderActive: '#02dbb7',
    inputIcon: '#6B7280',
    shimmerStart: '#E8EDF3',
    shimmerEnd: '#F5F7FA',
  },
  dark: {
    text: '#FFFFFF',
    secondaryText: '#B0BEC5',
    background: '#1A1A2E',
    tint: tintColorDark,
    card: '#252538',
    cardGradientStart: '#2D2D44',
    cardGradientEnd: '#1F1F35',
    border: '#4A4A6A',
    disabled: '#4A4A6A',
    inputBorder: '#3D3D5C',
    inputBorderActive: '#02dbb7',
    inputIcon: '#9CA3AF',
    shimmerStart: '#3D3D5C',
    shimmerEnd: '#252538',
  },
};

type ColorSchemeName = 'light' | 'dark' | 'unspecified' | null;

export function getColors(scheme: ColorSchemeName) {
  if (scheme === 'dark') return Colors.dark;
  return Colors.light;
}
