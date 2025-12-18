import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

import logo from '@/assets/images/logo/logo.png';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color='#808080'
          name='chevron.left.forwardslash.chevron.right'
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title' style={{ fontFamily: Fonts.rounded }}>
          Explore
        </ThemedText>
      </ThemedView>

      <ThemedText>This app includes example code to help you get started.</ThemedText>

      <Collapsible title='File-based routing'>
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type='defaultSemiBold'>app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>

        <ThemedText>
          The layout file in <ThemedText type='defaultSemiBold'>app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>

        <ExternalLink href='https://docs.expo.dev/router/introduction'>
          <ThemedText type='link'>Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title='Platform support'>
        <ThemedText>You can open this project on Android, iOS, and Web.</ThemedText>
      </Collapsible>

      <Collapsible title='Images'>
        <ThemedText>
          Static images support different densities using{' '}
          <ThemedText type='defaultSemiBold'>@2x</ThemedText> and{' '}
          <ThemedText type='defaultSemiBold'>@3x</ThemedText>.
        </ThemedText>

        <Image source={logo} style={styles.logo} contentFit='contain' />

        <ExternalLink href='https://reactnative.dev/docs/images'>
          <ThemedText type='link'>Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title='Light & Dark Mode'>
        <ThemedText>The app supports system light and dark mode automatically.</ThemedText>
      </Collapsible>

      <Collapsible title='Animations'>
        <ThemedText>
          Animations are powered by{' '}
          <ThemedText type='defaultSemiBold' style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>
          .
        </ThemedText>

        {Platform.OS === 'ios' && <ThemedText>iOS uses a parallax scrolling header.</ThemedText>}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    bottom: -90,
    left: -35,
    color: '#808080',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 12,
  },
});
