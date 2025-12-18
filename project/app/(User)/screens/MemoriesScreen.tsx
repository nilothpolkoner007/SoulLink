import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Lock, Sparkles } from 'lucide-react-native';

type Memory = {
  id: string;
  title: string;
  date: string;
  image: string;
};

const memories: Memory[] = [
  {
    id: '1',
    title: 'Our First Trip',
    date: '12 Jan 2025',
    image: 'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg',
  },
  {
    id: '2',
    title: 'Late Night Call',
    date: '03 Feb 2025',
    image: 'https://images.pexels.com/photos/1024969/pexels-photo-1024969.jpeg',
  },
  {
    id: '3',
    title: 'Coffee Date',
    date: '15 Feb 2025',
    image: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg',
  },
  {
    id: '4',
    title: 'Sunset Together',
    date: '28 Feb 2025',
    image: 'https://images.pexels.com/photos/1024970/pexels-photo-1024970.jpeg',
  },
];

export default function MemoriesScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const numColumns = isLargeScreen ? 4 : 2;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#FFA07A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Memories</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color='#FF6B9D' strokeWidth={3} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.aiHighlight}>
        <Sparkles size={18} color='#FF6B9D' />
        <Text style={styles.aiText}>
          Your happiest moments are video calls
        </Text>
      </View>

      <FlatList
        data={memories}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemoryCard item={item} isLarge={isLargeScreen} />}
        ListFooterComponent={<VaultCard />}
      />
    </View>
  );
}

function MemoryCard({ item, isLarge }: { item: Memory; isLarge: boolean }) {
  return (
    <TouchableOpacity style={[styles.card, { height: isLarge ? 240 : 200 }]} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.cardOverlay}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function VaultCard() {
  return (
    <TouchableOpacity style={styles.vaultCard} activeOpacity={0.9}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.vaultGradient}
      >
        <Lock size={32} color='#fff' />
        <Text style={styles.vaultTitle}>Memory Vault</Text>
        <Text style={styles.vaultSubtitle}>Unlock with dual authentication</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  aiHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  aiText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 12,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDate: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  vaultCard: {
    marginHorizontal: 8,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  vaultGradient: {
    padding: 32,
    alignItems: 'center',
  },
  vaultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  vaultSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    textAlign: 'center',
  },
});
