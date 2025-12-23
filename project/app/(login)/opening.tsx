import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function Opening() {
  return (
    <LinearGradient colors={['#fdfbfb', '#ebedee']} style={styles.container}>
      <View style={styles.content}>
        <LottieView
          source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_5tkzkblw.json' }} // Floating hearts animation
          autoPlay
          loop
          style={styles.logo}
        />
        <ThemedText style={styles.title}>SoulLink</ThemedText>
        <ThemedText style={styles.subtitle}>Connect Hearts, Share Moments</ThemedText>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(login)/login')}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/(login)/signup')}>
          <ThemedText style={styles.buttonSecondaryText}>Create Account</ThemedText>
        </TouchableOpacity>
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
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6F91',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF6F91',
    padding: 16,
    borderRadius: 12,
    width: width * 0.8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    borderWidth: 2,
    borderColor: '#FF6F91',
    padding: 16,
    borderRadius: 12,
    width: width * 0.8,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#FF6F91',
    fontSize: 18,
    fontWeight: '600',
  },
});