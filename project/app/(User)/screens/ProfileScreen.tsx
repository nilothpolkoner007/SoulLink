import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderWithMenu from '../components/HeaderWithMenu';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768; // tablet / laptop breakpoint

  return (
    <View style={styles.root}>
      <HeaderWithMenu title='Profile' />

      <ScrollView contentContainerStyle={[styles.container, isLarge && styles.containerLarge]}>
        {/* Profile Banner */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
          }}
          style={[styles.banner, isLarge && styles.bannerLarge]}
          imageStyle={styles.bannerImage}
        >
          <Text style={styles.quote}>“With you, every moment feels like home ❤️”</Text>
        </ImageBackground>

        {/* Details Card */}
        <View style={[styles.card, isLarge && styles.cardLarge]}>
          <Text style={styles.name}>Nilothpol 💕</Text>
          <Text style={styles.nickname}>Nickname: Nilo</Text>

          <View style={styles.durationBox}>
            <Ionicons name='heart' size={20} color='#ff4d6d' />
            <Text style={styles.durationText}>Together for 325 days</Text>
          </View>
        </View>

        {/* Social Links */}
        <View style={[styles.card, isLarge && styles.cardLarge]}>
          <Text style={styles.sectionTitle}>Social Links</Text>

          <View style={styles.socialRow}>
            <Ionicons name='logo-instagram' size={24} color='#E1306C' />
            <Ionicons name='musical-notes' size={24} color='#1DB954' />
            <Ionicons name='logo-twitter' size={24} color='#000' />
          </View>
        </View>

        {/* Private Journal */}
        <TouchableOpacity style={[styles.card, styles.lockCard, isLarge && styles.cardLarge]}>
          <Ionicons name='lock-closed' size={22} color='#ff4d6d' />
          <Text style={styles.lockText}>Private Journal</Text>
          <Text style={styles.lockSub}>Biometric authentication required</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <View style={[styles.card, isLarge && styles.cardLarge]}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <Text style={styles.notification}>💕 Your partner added a new memory</Text>
          <Text style={styles.notification}>🎉 Anniversary coming up soon</Text>
        </View>

        {/* Mood History Preview */}
        <View style={[styles.card, isLarge && styles.cardLarge]}>
          <Text style={styles.sectionTitle}>Mood History (Last 7 Days)</Text>

          <View style={styles.moodRow}>
            <Text>😍</Text>
            <Text>😊</Text>
            <Text>😐</Text>
            <Text>😍</Text>
            <Text>😢</Text>
            <Text>😍</Text>
            <Text>😊</Text>
          </View>
        </View>

        {/* Advanced Profile Hint */}
        <View style={styles.footerHint}>
          <Ionicons name='menu' size={16} color='#999' />
          <Text style={styles.footerText}>Advanced profile available in menu</Text>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fdf2f8',
  },
  container: {
    padding: 16,
  },
  containerLarge: {
    paddingHorizontal: 120,
  },

  banner: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
    marginBottom: 20,
  },
  bannerLarge: {
    height: 280,
  },
  bannerImage: {
    borderRadius: 20,
  },
  quote: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
  },

  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardLarge: {
    padding: 24,
  },

  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  nickname: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  durationText: {
    color: '#ff4d6d',
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 20,
  },

  lockCard: {
    alignItems: 'center',
  },
  lockText: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '500',
  },
  lockSub: {
    fontSize: 12,
    color: '#888',
  },

  notification: {
    fontSize: 14,
    marginBottom: 6,
  },

  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 22,
  },

  footerHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
