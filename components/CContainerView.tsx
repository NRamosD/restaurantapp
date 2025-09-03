import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CContainerViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  withBottomPadding?: boolean;
};

export function CContainerView({ style, lightColor, darkColor, withBottomPadding=true, ...otherProps }: CContainerViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets()

  return <View style={[{ backgroundColor,
    paddingTop: insets.top,
    paddingBottom: withBottomPadding ? insets.bottom : 0,
   }, style]} {...otherProps} />;
}
