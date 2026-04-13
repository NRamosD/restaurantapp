import { Text, type TextProps, StyleSheet, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TYPE_CTEXT, enum_TYPETEXT } from '@/constants/const';
import { useAppTheme } from '@/theme';
import { useAppearanceStore } from '@/hooks/useAppearanceStore';

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
  const fontScale = useAppearanceStore((state) => state.fontScale);
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const typeStyle = type === enum_TYPETEXT.link
    ? { ...TEXT_STYLES.link, color: theme.colors.text.link }
    : TEXT_STYLES[type] || TEXT_STYLES.default;
  const scaledTypeStyle: TextStyle = {
    ...typeStyle,
    fontSize: typeStyle.fontSize ? typeStyle.fontSize * fontScale : undefined,
    lineHeight: typeStyle.lineHeight ? typeStyle.lineHeight * fontScale : undefined,
  };

  return (
    <Text
      style={[
        { color },
        scaledTypeStyle,
        style,
      ]}
      {...rest}
    />
  );
}
