import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import frontpage from '../assets/images/logo/icon.png';
import { ThemedText } from '@/components/themed-text';

export default function FrontPage() {
  const router = useRouter();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 12 });
    scale.value = withSequence(
      withSpring(1.1, { damping: 8 }),
      withRepeat(withSpring(1, { damping: 10 }), -1, true),
    );

    const timer = setTimeout(() => {
      router.replace('/LoveScreen');
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FFA07A', '#FFB6C1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <Image source={frontpage} style={styles.logo} resizeMode='contain' />
        <ThemedText style={styles.appName}>SoulLink</ThemedText>
        <ThemedText style={styles.tagline}>Where hearts stay connected</ThemedText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
    fontWeight: '500',
  },
});
