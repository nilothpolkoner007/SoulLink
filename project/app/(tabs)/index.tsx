import { View, StyleSheet, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Heart, MessageCircle, Gift, Image as ImageIcon } from 'lucide-react-native';

const features = [
  { icon: MessageCircle, title: 'Private Chat', description: 'Secure messaging with your partner' },
  { icon: ImageIcon, title: 'Shared Memories', description: 'Capture and cherish moments together' },
  { icon: Gift, title: 'Send Gifts', description: 'Surprise your loved one anytime' },
  { icon: Heart, title: 'Track Emotions', description: 'AI-powered relationship insights' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLarge = width > 768;
  const heartScale = useSharedValue(1);

  useEffect(() => {
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const type = await AsyncStorage.getItem('userType');
      if (!type) return;

      if (type === 'user') router.replace('/(user)/home');
      if (type === 'admin') router.replace('/(admin)/dashboard');
      if (type === 'productmanager') router.replace('/(ProductManager)/manager/Dashboard');
      if (type === 'deliveryboy') router.replace('/(Delivery)/Home');
    };

    checkUser();
  }, []);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <LinearGradient
      colors={['#FFF5F8', '#FFFFFF', '#F0F9FF']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isLarge && styles.scrollContentLarge]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Animated.View style={heartStyle}>
            <View style={styles.heartContainer}>
              <Heart size={48} color='#FF6B9D' fill='#FF6B9D' />
            </View>
          </Animated.View>

          <ThemedText style={styles.title}>SoulLink</ThemedText>
          <ThemedText style={styles.subtitle}>
            Where two hearts stay connected forever
          </ThemedText>
        </View>

        <View style={[styles.featuresGrid, isLarge && styles.featuresGridLarge]}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <feature.icon size={28} color='#FF6B9D' strokeWidth={2} />
              </View>
              <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
              <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => router.push('/chooseUser')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF6B9D', '#FF8FB3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  scrollContentLarge: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heartContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 400,
  },
  featuresGrid: {
    gap: 16,
    marginBottom: 40,
  },
  featuresGridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    minWidth: 250,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ctaContainer: {
    marginTop: 20,
  },
  buttonWrapper: {
    borderRadius: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
});
