import { Text, type TextProps, StyleSheet, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TYPE_CTEXT, enum_TYPETEXT } from '@/constants/const';

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
    color: '#0a7ea4',
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
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const typeStyle = TEXT_STYLES[type] || TEXT_STYLES.default;

  return (
    <Text
      style={[
        { color },  // siempre puedes sobreescribir este con `style`
        typeStyle,
        style,
      ]}
      {...rest}
    />
  );
}
