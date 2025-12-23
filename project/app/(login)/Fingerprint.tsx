// Fingerprint.tsx
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function Fingerprint() {
  const [authenticated, setAuthenticated] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [path, setPath] = useState<string>('');
  const pathRef = useRef('');

  // ------------------- Biometric Auth -------------------
  const biometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Error', 'Device does not support biometrics. Please use alternative login.');
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock SoulLink 💖',
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) setAuthenticated(true);
    return result.success;
  };

  // Auto-trigger biometric on mount
  useEffect(() => {
    const autoAuth = async () => {
      await biometricAuth();
    };
    autoAuth();
  }, []);

  // ------------------- Gesture Hash -------------------
  const hashGesture = async (points: string) => {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, points);
  };

  const saveGesture = async (hash: string) => {
    await SecureStore.setItemAsync('love_gesture', hash);
    Alert.alert('Success', 'Gesture saved securely 💖');
  };

  const verifyGesture = async (inputHash: string) => {
    const stored = await SecureStore.getItemAsync('love_gesture');
    return stored === inputHash;
  };

  // ------------------- Gesture Capture -------------------
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setDrawing(true);
      pathRef.current = `M 0 0`;
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current += ` L ${locationX} ${locationY}`;
      setPath(pathRef.current);
    },
    onPanResponderRelease: async () => {
      setDrawing(false);
      const gestureHash = await hashGesture(pathRef.current);
      const stored = await SecureStore.getItemAsync('love_gesture');

      if (!stored) {
        // First time save
        await saveGesture(gestureHash);
      } else {
        const valid = await verifyGesture(gestureHash);
        if (valid) {
          Alert.alert('Success', 'Gesture verified 💞');
        } else {
          Alert.alert('Error', 'Gesture does not match 💔');
        }
      }

      setPath('');
      pathRef.current = '';
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SoulLink Lock 🔒</Text>

      {!authenticated && (
        <TouchableOpacity style={styles.button} onPress={biometricAuth}>
          <Text style={styles.buttonText}>Unlock with Fingerprint / FaceID</Text>
        </TouchableOpacity>
      )}

      {authenticated && (
        <>
          <Text style={styles.text}>Draw your Love Gesture 💖</Text>
          <View style={styles.canvas} {...panResponder.panHandlers}>
            <Svg style={{ flex: 1 }}>
              <Path d={path} stroke='#FF6F91' strokeWidth={4} fill='none' />
            </Svg>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF6F91',
  },
  button: {
    backgroundColor: '#FF6F91',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    width: width * 0.8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    fontSize: 20,
    marginBottom: 12,
    color: '#FF6F91',
  },
  canvas: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: '#FFE4E1',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
