import { ThemedText } from '@/components/themed-text';
import { API_BASE } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      // Mandatory biometric before checking token validity
      const biometricResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock SoulLink 💖',
        fallbackLabel: 'Use Passcode',
      });
      if (!biometricResult.success) {
        await AsyncStorage.removeItem('token');
        return;
      }

      // Check if token is valid
      try {
        const response = await axios.get(`${API_BASE}/user/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(User)/PartnerConnectScreen');
        }
      } catch (error) {
        // Token invalid, stay on login
        await AsyncStorage.removeItem('token');
      }
    }
  };

  async function login() {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/user/login`, { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);

      // Mandatory biometric authentication
      const biometricResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock SoulLink 💖',
        fallbackLabel: 'Use Passcode',
      });
      if (!biometricResult.success) {
        alert('Biometric authentication failed. Please try again.');
        await AsyncStorage.removeItem('token'); // Remove token if biometric fails
        return;
      }

      // Check if has partner
      const connectionsResponse = await axios.get(`${API_BASE}/user/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (connectionsResponse.data.length > 0) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(User)/PartnerConnectScreen');
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.massage || 'Unknown error'));
    }
  }

  return (
    <LinearGradient colors={['#fdfbfb', '#ebedee']} style={styles.container}>
      <View style={styles.card}>
        <ThemedText style={styles.title}>Welcome Back</ThemedText>
        <ThemedText style={styles.subtitle}>Login to continue to SoulLink</ThemedText>

        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          placeholder='example@email.com'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />

        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput
          style={styles.input}
          placeholder='••••••••'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={login}>
          <ThemedText style={styles.loginText}>Login</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.or}>OR</ThemedText>

        <TouchableOpacity style={styles.googleBtn}>
          <ThemedText style={styles.googleText}>Continue with Google</ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText onPress={() => router.push('/(login)/signup')}>Create account</ThemedText>
          <ThemedText>Forgot password?</ThemedText>
        </View>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 6 },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  label: { marginBottom: 4, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  loginBtn: {
    backgroundColor: '#0a7ea4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: { color: '#fff', fontSize: 16 },
  or: { textAlign: 'center', marginVertical: 12, color: '#999' },
  googleBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleText: { fontSize: 15, color: '#444' },
  footer: {

    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
