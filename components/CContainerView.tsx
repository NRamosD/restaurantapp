import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CContainerViewProps = ViewProps & {
  withBottomPadding?: boolean;
};

export function CContainerView({ style, withBottomPadding=true, ...otherProps }: CContainerViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets()

  return <View style={[{ backgroundColor,
    paddingTop: insets.top,
    paddingBottom: withBottomPadding ? insets.bottom : 0,
   }, style]} {...otherProps} />;
}
