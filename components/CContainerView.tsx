import { View, type ViewProps, KeyboardAvoidingView, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CContainerViewProps = ViewProps & {
  withBottomPadding?: boolean;
  avoidKeyboard?: boolean;
};

export function CContainerView({ style, withBottomPadding=true, avoidKeyboard=false, ...otherProps }: CContainerViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets()

  if(avoidKeyboard){
    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[{ backgroundColor,
      paddingTop: insets.top,
      paddingBottom: withBottomPadding ? insets.bottom : 0,
    }, style]} {...otherProps} />;
  }

  return <View style={[{ backgroundColor,
    paddingTop: insets.top,
    paddingBottom: withBottomPadding ? insets.bottom : 0,
   }, style]} {...otherProps} />;
}
