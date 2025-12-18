import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';

const easing = Easing.bezier(0.22, 0.9, 0.28, 1);

type Gender = 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
type Status = 'Single' | 'Dating' | 'Engaged' | 'Married' | 'It’s Complicated';

export default function Signup() {
  const [index, setIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [instagram, setInstagram] = useState('');
  const [instagramError, setInstagramError] = useState('');
  const [facebook, setFacebook] = useState('');
  const [facebookError, setFacebookError] = useState('');
  const [biometricDone, setBiometricDone] = useState(false);
  const [oauthToken, setOauthToken] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const x = useSharedValue(0);
  const prog = useSharedValue(0);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    x.value = withTiming(-index * 1, { duration: 320, easing });
    prog.value = withTiming((index + 1) / 5, { duration: 320, easing });
  }, [index, x, prog]);

  const pageW = Dimensions.get('window').width;
  const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * pageW }] }));

  const next = () => setIndex((i) => Math.min(4, i + 1));
  const back = () => setIndex((i) => Math.max(0, i - 1));

  const validateName = () => {
    const v = name.trim();
    if (v.length < 2 || v.length > 50) setNameError('Please enter your full name.');
    else setNameError('');
    return !nameError && v.length >= 2 && v.length <= 50;
  };

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]) {
      const asset = res.assets[0];
      if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
        setPhotoError('File too large. Try a smaller image.');
        return;
      }
      const crop = await ImageManipulator.manipulateAsync(
        asset.uri,
        [
          {
            crop: { originX: 0, originY: 0, width: asset.width || 512, height: asset.width || 512 },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
      );
      setPhoto(crop.uri);
      setPhotoError('');
    }
  };

  const validateDob = () => {
    if (!dob) {
      setDobError('Enter a valid birthday.');
      return false;
    }
    const d = new Date(dob);
    const now = new Date();
    const years = (now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (!isFinite(years) || years < 13) {
      setDobError('Enter a valid birthday.');
      return false;
    }
    setDobError('');
    return true;
  };

  const validateSocial = () => {
    if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) {
      setInstagramError('Invalid Instagram username.');
      return false;
    }
    setInstagramError('');
    if (facebook && !/^https?:\/\/.+/.test(facebook)) {
      setFacebookError('Invalid Facebook URL.');
      return false;
    }
    setFacebookError('');
    return true;
  };

  const enableBiometric = async () => {
    const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Enable Biometric' });
    if (res.success) {
      await SecureStore.setItemAsync('biometric_enabled', 'true');
      setBiometricDone(true);
      lottieRef.current?.reset();
      lottieRef.current?.play();
      track('signup_biometric_enabled');
      next();
    }
  };

  const linkProvider = async (provider: 'google' | 'apple' | 'facebook') => {
    setLinking(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setOauthToken('token');
    } finally {
      setLinking(false);
    }
  };

  const oauthSignup = async (provider: 'google' | 'apple' | 'facebook') => {
    setScrollEnabled(false);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      track('signup_oauth_success');
      const has = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (has && enrolled) {
        const confirm = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirm identity',
        });
        if (confirm.success) {
          track('signup_oauth_biometric_confirmed');
          finish();
        }
      } else {
        setShowPinSetup(true);
      }
    } finally {
      setScrollEnabled(true);
    }
  };

  const finish = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#ffd9e6', '#e0f0ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.progressWrap}>
        <ThemedText style={styles.progressText}>{index + 1}/5</ThemedText>
        <LottieView
          source={{ uri: 'https://assets7.lottiefiles.com/packages/lf20_Cc8Bqk.json' }}
          autoPlay
          loop
          style={{ width: 60, height: 18 }}
        />
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: 5 * pageW }}
      >
        <Animated.View style={[styles.stepWrap, slideStyle]}>
          <StepBasic
            name={name}
            setName={setName}
            error={nameError}
            onNext={() => {
              if (validateName()) next();
            }}
          />
          <StepPhoto
            photo={photo}
            error={photoError}
            onPick={pickPhoto}
            onNext={() => next()}
            onSkip={() => next()}
          />
          <StepDobGender
            dob={dob}
            setDob={setDob}
            gender={gender}
            setGender={setGender}
            error={dobError}
            onNext={() => {
              if (validateDob()) next();
            }}
            onBack={back}
          />
          <StepStatusSocial
            status={status}
            setStatus={setStatus}
            instagram={instagram}
            setInstagram={setInstagram}
            instagramError={instagramError}
            facebook={facebook}
            setFacebook={setFacebook}
            facebookError={facebookError}
            onNext={() => {
              if (validateSocial()) next();
            }}
            onBack={back}
          />
          <StepVerifyFinish
            biometricDone={biometricDone}
            enableBiometric={enableBiometric}
            linkProvider={linkProvider}
            oauthToken={oauthToken}
            onFinish={finish}
            oauthSignup={oauthSignup}
            busy={linking || !scrollEnabled}
          />
        </Animated.View>
      </ScrollView>
      {showPinSetup && (
        <PinSetup
          onDone={() => {
            setShowPinSetup(false);
            finish();
          }}
          onClose={() => setShowPinSetup(false)}
        />
      )}
    </LinearGradient>
  );
}

function track(event: string) {
  console.log(event);
}

function StepBasic({
  name,
  setName,
  error,
  onNext,
}: {
  name: string;
  setName: (v: string) => void;
  error: string;
  onNext: () => void;
}) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Basic</ThemedText>
      <ThemedText>Full Name</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder='Enter your name'
        style={styles.input}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <TouchableOpacity
        disabled={!name.trim()}
        onPress={onNext}
        style={[styles.nextBtn, !name.trim() && styles.nextBtnDisabled]}
      >
        <ThemedText style={styles.nextText}>Next</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function StepPhoto({
  photo,
  error,
  onPick,
  onNext,
  onSkip,
}: {
  photo: string | null;
  error: string;
  onPick: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Profile Photo</ThemedText>
      <View style={styles.avatarWrap}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <TouchableOpacity onPress={onPick} style={styles.avatarPlaceholder}>
            <ThemedText>📷</ThemedText>
          </TouchableOpacity>
        )}
      </View>
      <ThemedText style={styles.micro}>Add a photo to make your SoulLink personal.</ThemedText>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <View style={styles.row}>
        <TouchableOpacity onPress={onSkip}>
          <ThemedText style={styles.linkSmall}>Skip</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
          <ThemedText style={styles.nextText}>Next</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepDobGender({
  dob,
  setDob,
  gender,
  setGender,
  error,
  onNext,
  onBack,
}: {
  dob: string;
  setDob: (v: string) => void;
  gender: Gender | null;
  setGender: (g: Gender) => void;
  error: string;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>DOB & Gender</ThemedText>
      <ThemedText>Date of Birth</ThemedText>
      <TextInput
        value={dob}
        onChangeText={setDob}
        placeholder='YYYY-MM-DD'
        inputMode='numeric'
        style={styles.input}
      />
      <ThemedText>Gender</ThemedText>
      <View style={styles.pills}>
        {(['Female', 'Male', 'Non-binary', 'Prefer not to say'] as Gender[]).map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g)}
            style={[styles.pill, gender === g && styles.pillActive]}
          >
            <ThemedText>{g}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText style={styles.micro}>
        Helps calculate relationship duration and anniversaries.
      </ThemedText>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack}>
          <ThemedText style={styles.linkSmall}>Back</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
          <ThemedText style={styles.nextText}>Next</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepStatusSocial({
  status,
  setStatus,
  instagram,
  setInstagram,
  instagramError,
  facebook,
  setFacebook,
  facebookError,
  onNext,
  onBack,
}: {
  status: Status | null;
  setStatus: (s: Status) => void;
  instagram: string;
  setInstagram: (s: string) => void;
  instagramError: string;
  facebook: string;
  setFacebook: (s: string) => void;
  facebookError: string;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Status & Social</ThemedText>
      <ThemedText>Present Relationship Status</ThemedText>
      <View style={styles.pills}>
        {(['Single', 'Dating', 'Engaged', 'Married', 'It’s Complicated'] as Status[]).map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.pill, status === s && styles.pillActive]}
          >
            <ThemedText>{s}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText>Instagram Username</ThemedText>
      <TextInput
        value={instagram}
        onChangeText={setInstagram}
        placeholder='instagram_username'
        style={styles.input}
      />
      {instagramError ? <ThemedText style={styles.error}>{instagramError}</ThemedText> : null}
      <ThemedText>Facebook Profile Link</ThemedText>
      <TextInput
        value={facebook}
        onChangeText={setFacebook}
        placeholder='https://'
        style={styles.input}
      />
      {facebookError ? <ThemedText style={styles.error}>{facebookError}</ThemedText> : null}
      <ThemedText style={styles.micro}>Only visible to your connected partner.</ThemedText>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBack}>
          <ThemedText style={styles.linkSmall}>Back</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
          <ThemedText style={styles.nextText}>Next</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepVerifyFinish({
  biometricDone,
  enableBiometric,
  linkProvider,
  oauthToken,
  onFinish,
  oauthSignup,
  busy,
}: {
  biometricDone: boolean;
  enableBiometric: () => void;
  linkProvider: (p: 'google' | 'apple' | 'facebook') => void;
  oauthToken: string | null;
  onFinish: () => void;
  oauthSignup: (p: 'google' | 'apple' | 'facebook') => void;
  busy: boolean;
}) {
  const ref = useRef<LottieView>(null);
  useEffect(() => {
    if (biometricDone) {
      ref.current?.reset();
      ref.current?.play();
    }
  }, [biometricDone]);
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Verification</ThemedText>
      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={enableBiometric} style={styles.primaryBtn}>
          <ThemedText style={styles.primaryBtnText}>Enable Biometric</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onFinish}>
          <ThemedText style={styles.linkSmall}>Skip</ThemedText>
        </TouchableOpacity>
      </View>
      <LottieView
        ref={ref}
        source={{ uri: 'https://assets1.lottiefiles.com/packages/lf20_dkptc6ub.json' }}
        autoPlay={false}
        loop={false}
        style={{ width: 120, height: 120, alignSelf: 'center' }}
      />
      <View style={styles.divider} />
      <ThemedText>Link accounts</ThemedText>
      <View style={styles.rowCenter}>
        <TouchableOpacity
          disabled={busy}
          onPress={() => oauthSignup('google')}
          style={[styles.oauthBtn, busy && styles.nextBtnDisabled]}
        >
          <ThemedText>Link Google</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity disabled={busy} onPress={() => oauthSignup('apple')} style={[styles.oauthBtn, busy && styles.nextBtnDisabled]}>
          <ThemedText>Link Apple</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity disabled={busy} onPress={() => oauthSignup('facebook')} style={[styles.oauthBtn, busy && styles.nextBtnDisabled]}>
          <ThemedText>Link Facebook</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.rowCenter}>
        <LottieView
          source={{ uri: 'https://assets9.lottiefiles.com/private_files/lf30_rvwn1mau.json' }}
          autoPlay
          loop
          style={{ width: 120, height: 90 }}
        />
      </View>
      <TouchableOpacity onPress={onFinish} style={styles.primaryBtn}>
        <ThemedText style={styles.primaryBtnText}>Generate Partner Code</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressWrap: {
    paddingHorizontal: 24,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: { fontSize: 16 },
  stepWrap: { flexDirection: 'row' },
  card: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 6,
    padding: 24,
  },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginTop: 8 },
  nextBtn: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextText: { color: '#fff', fontSize: 16 },
  linkSmall: { fontSize: 14, color: '#0a7ea4' },
  error: { color: '#d93737', fontSize: 14, marginTop: 8 },
  micro: { fontSize: 14, textAlign: 'center', marginVertical: 8 },
  avatarWrap: { alignItems: 'center', marginVertical: 10 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pillActive: { backgroundColor: '#e9f6ff', borderColor: '#0a7ea4' },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  primaryBtn: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontSize: 16 },
  oauthBtn: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
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
function hashPin(pin: string) {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (h << 5) - h + pin.charCodeAt(i);
  return String(h);
}

function PinSetup({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const verify = async () => {
    if (pin.length !== 4) {
      setError('Enter 4-digit PIN.');
      return;
    }
    await SecureStore.setItemAsync('user_pin_hash', hashPin(pin));
    onDone();
  };
  return (
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <ThemedText style={styles.modalTitle}>Set PIN</ThemedText>
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
      </View>
    </View>
  );
}
