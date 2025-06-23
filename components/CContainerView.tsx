import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CContainerViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function CContainerView({ style, lightColor, darkColor, ...otherProps }: CContainerViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets()

  return <View style={[{ backgroundColor,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
   }, style]} {...otherProps} />;
}
