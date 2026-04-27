import { type ViewProps, KeyboardAvoidingView, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export type CContainerViewProps = ViewProps & {
  withBottomPadding?: boolean;
  avoidKeyboard?: boolean;
};

export function CContainerView({ style, withBottomPadding=true, avoidKeyboard=false, children, ...otherProps }: CContainerViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const edges = withBottomPadding ? ['top', 'bottom'] as const : ['top'] as const;

  if(avoidKeyboard){
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView edges={edges} style={{ backgroundColor, flex:1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[{ flex:1 }, style]}
            {...otherProps}
          >
            {children}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }

  return <SafeAreaView edges={edges} style={[{ backgroundColor, flex:1 }, style]} {...otherProps}>{children}</SafeAreaView>;
}
