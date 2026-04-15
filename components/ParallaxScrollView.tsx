import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { CView } from '@/components/CView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { type AppThemePreset } from '@/hooks/useAppearanceStore';
import { resolveThemeMode } from '@/theme';

const HEADER_HEIGHT = 350;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: Partial<Record<AppThemePreset, string>> & { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = resolveThemeMode(useColorScheme());
  const resolvedHeaderBackgroundColor =
    headerBackgroundColor[colorScheme] ??
    (colorScheme === 'dark' ? headerBackgroundColor.dark : headerBackgroundColor.light);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <CView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: resolvedHeaderBackgroundColor },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <CView style={styles.content}>{children}</CView>
      </Animated.ScrollView>
    </CView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
