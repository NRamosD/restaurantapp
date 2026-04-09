import { Text, type TextProps, StyleSheet, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TYPE_CTEXT, enum_TYPETEXT } from '@/constants/const';
import { useAppTheme } from '@/theme';

const TEXT_STYLES: Record<string, TextStyle> = {
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
};

export type CTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TYPE_CTEXT
};

export function CText({
  style,
  lightColor,
  darkColor,
  type = enum_TYPETEXT.default,
  ...rest
}: CTextProps) {
  const theme = useAppTheme();
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const typeStyle = type === enum_TYPETEXT.link
    ? { ...TEXT_STYLES.link, color: theme.colors.text.link }
    : TEXT_STYLES[type] || TEXT_STYLES.default;

  return (
    <Text
      style={[
        { color },
        typeStyle,
        style,
      ]}
      {...rest}
    />
  );
}
