import { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, AccessibilityInfo } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';

const easing = Easing.bezier(0.22, 0.9, 0.28, 1);

export default function Login() {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);

  const pulse = useSharedValue(1);
  const cardY = useSharedValue(0);
  const lottieRef = useRef<LottieView>(null);

  // Check for biometric availability
  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then(async (has) => {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(has && enrolled);
    });
  }, []);

  // Trigger fingerprint automatically
  useEffect(() => {
    AccessibilityInfo.setAccessibilityFocus?.(undefined);
    if (biometricAvailable) {
      const t = setTimeout(() => handleFingerprint(), 400);
      return () => clearTimeout(t);
    }
  }, [biometricAvailable]);

  // Pulse animation
  useEffect(() => {
    pulse.value = withTiming(1.08, { duration: 620, easing }, () => {
      pulse.value = withTiming(1, { duration: 620, easing });
    });
  }, [authenticating]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const slideUpStyle = useAnimatedStyle(() => ({ transform: [{ translateY: cardY.value }] }));

  // Fingerprint handler
  const handleFingerprint = useCallback(async () => {
    if (!biometricAvailable || authenticating) return;
    setAuthenticating(true);
    setError('');

    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackEnabled: false,
    });

    if (res.success) {
      setSuccessAnim(true);
      lottieRef.current?.reset();
      lottieRef.current?.play();
      track('login_biometric_success');
      setTimeout(() => {
        cardY.value = withTiming(-40, { duration: 380, easing }, () => {
          redirectByRole();
        });
      }, 300);
    } else {
      setAuthenticating(false);
      setError('Fingerprint not recognized. Try again.');
      setAttempts((a) => {
        const n = a + 1;
        if (n >= 3) setShowPin(true);
        track('login_biometric_failed');
        return n;
      });
    }
  }, [biometricAvailable, authenticating, cardY]);

  // PIN success handler
  const handlePinSuccess = () => {
    setSuccessAnim(true);
    lottieRef.current?.reset();
    lottieRef.current?.play();
    setTimeout(() => {
      cardY.value = withTiming(-40, { duration: 380, easing }, () => {
        redirectByRole();
      });
    }, 300);
  };

  return (
    <LinearGradient
      colors={['#ffd9e6', '#e0f0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.centerWrap}>
        <Animated.View style={[styles.card, slideUpStyle]}>
          <ThemedText style={styles.title} accessibilityRole='header'>
            SoulLink — Unlock
          </ThemedText>
          <ThemedText style={styles.subtitle}>Securely open with fingerprint</ThemedText>

          <Animated.View style={[styles.fingerprintWrap, pulseStyle]}>
            <TouchableOpacity
              accessibilityLabel='Tap to authenticate — fingerprint required.'
              activeOpacity={0.8}
              onPress={handleFingerprint}
              style={styles.fingerprintBtn}
            >
              {!successAnim ? (
                <LottieView
                  source={{ uri: 'https://assets7.lottiefiles.com/packages/lf20_jcikwtux.json' }}
                  autoPlay
                  loop
                  style={{ width: 54, height: 54 }}
                />
              ) : (
                <LottieView
                  ref={lottieRef}
                  source={{ uri: 'https://assets1.lottiefiles.com/packages/lf20_dkptc6ub.json' }}
                  autoPlay={false}
                  loop={false}
                  style={{ width: 72, height: 72 }}
                />
              )}
            </TouchableOpacity>
          </Animated.View>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          <ThemedText style={styles.attempts}>Attempts {attempts}/3</ThemedText>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => setShowPin(true)}>
              <ThemedText style={styles.linkSmall}>Use PIN instead</ThemedText>
            </TouchableOpacity>
            <Link href='/auth/signup'>
              <ThemedText style={styles.linkSmall}>Sign in with account</ThemedText>
            </Link>
          </View>

          {!biometricAvailable && (
            <ThemedText style={styles.fallbackText}>Sign in with OAuth or PIN</ThemedText>
          )}
        </Animated.View>
      </View>

      {showPin && <PinModal onSuccess={handlePinSuccess} onClose={() => setShowPin(false)} />}
    </LinearGradient>
  );
}

// ---------- Helpers ----------

async function redirectByRole() {
  const userType = await SecureStore.getItemAsync('userType');
  switch (userType) {
    case 'user':
      router.replace('/user/home');
      break;
    case 'productmanager':
      router.replace('/productmanager/dashboard');
      break;
    case 'deliveryboy':
      router.replace('/deliveryboy/dashboard');
      break;
    case 'admin':
      router.replace('/admin/dashboard');
      break;
    default:
      router.replace('/auth/login');
  }
}

function track(event: string) {
  console.log(event);
}

function hashPin(pin: string) {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (h << 5) - h + pin.charCodeAt(i);
  return String(h);
}

// ---------- PIN Modal ----------
function PinModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const x = useSharedValue(60);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  useEffect(() => {
    x.value = withTiming(0, { duration: 320, easing });
  }, [x]);

  const verify = async () => {
    const stored = await SecureStore.getItemAsync('user_pin_hash');
    if (!stored) {
      await SecureStore.setItemAsync('user_pin_hash', hashPin(pin));
      onSuccess();
      return;
    }
    if (hashPin(pin) === stored) onSuccess();
    else setError('Incorrect PIN. Try again.');
  };

  return (
    <View style={styles.modalBackdrop}>
      <Animated.View style={[styles.modalCard, style]}>
        <ThemedText style={styles.modalTitle}>Enter PIN</ThemedText>
        <View style={styles.pinRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, pin.length > i ? styles.dotFilled : null]} />
          ))}
        </View>
        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', '✓'].map((k) => (
            <TouchableOpacity
              key={k}
              style={styles.key}
              onPress={() => {
                if (k === '←') setPin((p) => p.slice(0, -1));
                else if (k === '✓') verify();
                else if (pin.length < 4) setPin((p) => p + k);
              }}
            >
              <ThemedText style={styles.keyText}>{k}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <View style={styles.modalActions}>
          <TouchableOpacity onPress={onClose}>
            <ThemedText style={styles.linkSmall}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1 },
  centerWrap: { flex: 1, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 6,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 18 },
  fingerprintWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  fingerprintBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Platform.OS === 'ios' ? 0.2 : 0.6,
    borderColor: '#eee',
  },
  linksRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  linkSmall: { fontSize: 14, color: '#0a7ea4' },
  error: { color: '#d93737', fontSize: 14, marginTop: 8, textAlign: 'center' },
  attempts: { marginTop: 4, fontSize: 12, textAlign: 'center', color: '#687076' },
  fallbackText: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  modalBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: { width: '86%', backgroundColor: '#fff', borderRadius: 6, padding: 18 },
  modalTitle: { fontSize: 18, textAlign: 'center', marginBottom: 12 },
  pinRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#bbb' },
  dotFilled: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: {
    width: 72,
    height: 50,
    borderRadius: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  keyText: { fontSize: 18 },
  modalActions: { marginTop: 8, alignItems: 'center' },
});
