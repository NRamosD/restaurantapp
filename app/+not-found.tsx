import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { CText } from '@/components/CText';
import { CView } from '@/components/CView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <CView style={styles.container}>
        <CText type="title">This screen doesn't exist.</CText>
        <Link href="/" style={styles.link}>
          <CText type="link">Go to home screen</CText>
        </Link>
      </CView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
