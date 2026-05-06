import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

import { CText } from '../CText';
import { CView } from '../CView';
import { useAppTheme } from '@/theme';

type Props = {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
  style?: ViewStyle;
  showText?: boolean;
};

const GenericLoading = ({
  message = 'Cargando...',
  fullScreen = false,
  size = 'large',
  style,
  showText = true,
}: Props) => {
  const theme = useAppTheme();

  return (
    <CView
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        {
          backgroundColor: theme.colors.surface.background,
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} color={theme.components.button.primary.backgroundColor} />
      {showText && (
        <CText style={[styles.message, { color: theme.colors.text.secondary }]}>
          {message}
        </CText>
      )}
    </CView>
  );
};

export default GenericLoading;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
  },
});
