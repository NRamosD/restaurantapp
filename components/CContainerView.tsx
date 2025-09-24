import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

export type CContainerViewProps = ViewProps & {
  withBottomPadding?: boolean;
};

export function CContainerView({ style, withBottomPadding=true, ...otherProps }: CContainerViewProps) {
  const backgroundColor = useThemeColor({light: Colors['light'].background, dark: Colors['dark'].background}, 'background');
  const insets = useSafeAreaInsets()

  return <View style={[{ backgroundColor,
    paddingTop: insets.top,
    paddingBottom: withBottomPadding ? insets.bottom : 0,
   }, style]} {...otherProps} />;
}
