import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type CViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function CView({ style, lightColor, darkColor, ...otherProps }: CViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[lightColor || darkColor ? { backgroundColor } : null, style]} {...otherProps} />;
}
