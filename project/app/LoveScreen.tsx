import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';

export default function LoveScreen() {
  const router = useRouter();
  const heart1TranslateX = useSharedValue(-200);
  const heart2TranslateX = useSharedValue(200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate hearts sliding in
    heart1TranslateX.value = withSpring(0, { damping: 12 });
    heart2TranslateX.value = withDelay(300, withSpring(0, { damping: 12 }));

    // Fade in text
    opacity.value = withDelay(600, withSpring(1, { damping: 10 }));

    // Redirect after animation
    const timer = setTimeout(async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(login)/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const heart1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: heart1TranslateX.value }],
  }));

  const heart2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: heart2TranslateX.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FFA07A', '#FFB6C1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.heartsContainer}>
          <Animated.Text style={[styles.heart, heart1Style]}>❤️</Animated.Text>
          <Animated.Text style={[styles.heart, heart2Style]}>❤️</Animated.Text>
        </View>
        <Animated.View style={textStyle}>
          <ThemedText style={styles.loveText}>Two Hearts</ThemedText>
          <ThemedText style={styles.loveText}>Connecting</ThemedText>
        </Animated.View>
      </View>
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
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  heart: {
    fontSize: 80,
    marginHorizontal: 20,
  },
  loveText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
