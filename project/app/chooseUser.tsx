import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { Heart, Package, Truck, ShieldCheck } from 'lucide-react-native';

const userTypes = [
  {
    type: 'user',
    title: 'User',
    description: 'Connect with your soulmate',
    icon: Heart,
    route: '/User/Home',
    gradient: ['#FF6B9D', '#FF8FB3'],
  },
  {
    type: 'productmanager',
    title: 'Product Manager',
    description: 'Manage products and orders',
    icon: Package,
    route: '/ProductManager/manager/Dashboard/Dashboard',
    gradient: ['#4A90E2', '#67B5F5'],
  },
  {
    type: 'deliveryboy',
    title: 'Delivery Partner',
    description: 'Deliver happiness',
    icon: Truck,
    route: '/deliveryboy/home',
    gradient: ['#10B981', '#34D399'],
  },
  {
    type: 'admin',
    title: 'Administrator',
    description: 'System administration',
    icon: ShieldCheck,
    route: '/admin/',
    gradient: ['#F59E0B', '#FBBF24'],
  },
];

export default function ChooseUser() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FFF5F8', '#FFF', '#F0F9FF']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Welcome to SoulLink</ThemedText>
          <ThemedText style={styles.subtitle}>Choose your role to continue</ThemedText>
        </View>

        <View style={styles.cardsContainer}>
          {userTypes.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={styles.cardWrapper}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <View style={styles.iconContainer}>
                  <item.icon size={32} color='#fff' strokeWidth={2.5} />
                </View>
                <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.cardDescription}>{item.description}</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  cardWrapper: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});
