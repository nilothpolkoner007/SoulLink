import { ThemedText } from '@/components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Gift, Heart, Image as ImageIcon, MessageCircle, Video } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const features = [
  { icon: MessageCircle, title: 'Private Chat', description: 'Secure messaging with your partner' },
  { icon: Video, title: 'Video Calls', description: 'Connect face-to-face with your partner' },
  {
    icon: ImageIcon,
    title: 'Shared Memories',
    description: 'Capture and cherish moments together',
  },
  { icon: Gift, title: 'Send Gifts', description: 'Surprise your loved one anytime' },
  { icon: Heart, title: 'Track Emotions', description: 'AI-powered relationship insights' },
];

const testimonials = [
  { name: 'Alex & Jamie', quote: 'SoulLink brought us closer than ever!' },
  { name: 'Taylor & Morgan', quote: 'The best way to stay connected.' },
  { name: 'Jordan & Casey', quote: 'Our love story just got better.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLarge = width > 768;
  const heartScale = useSharedValue(1);

  useEffect(() => {
    heartScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      false,
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const checkUser = async () => {
      const type = await AsyncStorage.getItem('userType');
      if (!type) return;

      if (type === 'user') (router.replace as any)('/user/home');
      if (type === 'admin') (router.replace as any)('/admin/dashboard');
      if (type === 'productmanager') (router.replace as any)('/manager/Dashboard/Dashboard');
      if (type === 'deliveryboy') (router.replace as any)('/(Delivery)/Home');
    };

    checkUser();
  }, [router]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <LinearGradient colors={['#FFF5F8', '#FFFFFF', '#F0F9FF']} style={styles.container}>
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
          <ThemedText style={styles.subtitle}>Where two hearts stay connected forever</ThemedText>
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

        <View style={styles.testimonialsContainer}>
          <ThemedText style={styles.testimonialsTitle}>What Couples Say</ThemedText>
          <View style={[styles.testimonialsGrid, isLarge && styles.testimonialsGridLarge]}>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <ThemedText style={styles.testimonialQuote}>"{testimonial.quote}"</ThemedText>
                <ThemedText style={styles.testimonialName}>- {testimonial.name}</ThemedText>
              </View>
            ))}
          </View>
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
  testimonialsContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  testimonialsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  testimonialsGrid: {
    gap: 16,
  },
  testimonialsGridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  testimonialCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 280,
    maxWidth: 320,
  },
  testimonialQuote: {
    fontSize: 16,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
  },
  testimonialName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'right',
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
