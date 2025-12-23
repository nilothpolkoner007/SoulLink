import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import axios from 'axios';
import { API_BASE } from '@/constants/api';

type Gender = 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';

export default function Signup() {
  const [index, setIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState(''); // Added missing state
  const [gender, setGender] = useState<Gender | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [loveQuote, setLoveQuote] = useState('');
  const [loveQuoteError, setLoveQuoteError] = useState('');
  const [instagram, setInstagram] = useState('');
  const [instagramError, setInstagramError] = useState(''); // Added missing state
  const [spotify, setSpotify] = useState('');
  const [twitter, setTwitter] = useState('');
  const [biometricDone, setBiometricDone] = useState(false);
  const [partnerId, setPartnerId] = useState('');
  const lottieRef = useRef<LottieView>(null);

  const pageW = Dimensions.get('window').width;

  const next = () => setIndex((i) => Math.min(7, i + 1));
  const back = () => setIndex((i) => Math.max(0, i - 1));

  const validateName = () => {
    const v = name.trim();
    if (v.length < 2 || v.length > 50) {
      setNameError('Please enter your full name.');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateLoveQuote = () => {
    const v = loveQuote.trim();
    if (v.length < 5 || v.length > 100) {
      setLoveQuoteError('Please enter a short love quote (5-100 characters).');
      return false;
    }
    setLoveQuoteError('');
    return true;
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
    if (isNaN(years) || years < 13) {
      setDobError('You must be at least 13 years old.');
      return false;
    }
    setDobError('');
    return true;
  };

  const enableBiometric = async () => {
    const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Enable Biometric' });
    if (res.success) {
      await SecureStore.setItemAsync('biometric_enabled', 'true');
      setBiometricDone(true);
      lottieRef.current?.reset();
      lottieRef.current?.play();
    }
  };

  const finish = async () => {
    try {
      await axios.post(`${API_BASE}/user/register`, {
        name,
        email,
        password,
        birthday: dob,
        gender,
      });
      if (partnerId) {
        const loginRes = await axios.post(`${API_BASE}/user/login`, { email, password });
        const token = loginRes.data.token;
        await axios.post(
          `${API_BASE}/user/connect-partner`,
          { partnerCode: partnerId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      router.replace('/(User)/PartnerConnectScreen');
    } catch (error: any) {
      alert('Signup failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <LinearGradient colors={['#ffd9e6', '#e0f0ff']} style={styles.container}>
      <View style={styles.progressWrap}>
        <ThemedText style={styles.progressText}>{index + 1}/8</ThemedText>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: 8 * pageW }}
      >
        <StepBasic
          name={name}
          setName={setName}
          error={nameError}
          onNext={() => validateName() && next()}
        />
        <StepEmail email={email} setEmail={setEmail} onNext={next} />
        <StepPass password={password} setPassword={setPassword} onNext={next} />
        <StepDobGender
          dob={dob}
          setDob={setDob}
          gender={gender}
          setGender={setGender}
          error={dobError}
          onNext={() => validateDob() && next()}
          onBack={back}
        />
        <StepPhoto
          photo={photo}
          error={photoError}
          onPick={pickPhoto}
          onNext={next}
          onSkip={next}
        />
        <StepLoveQuote
          loveQuote={loveQuote}
          setLoveQuote={setLoveQuote}
          error={loveQuoteError}
          onNext={() => validateLoveQuote() && next()}
          onBack={back}
        />
        <StepSocial
          instagram={instagram}
          setInstagram={setInstagram}
          spotify={spotify}
          setSpotify={setSpotify}
          twitter={twitter}
          setTwitter={setTwitter}
          onNext={next}
          onBack={back}
        />
        <StepBiometric
          biometricDone={biometricDone}
          enableBiometric={enableBiometric}
          onNext={next}
        />
        <StepPartnerId
          partnerId={partnerId}
          setPartnerId={setPartnerId}
          onFinish={finish}
          onSkip={finish}
        />
      </ScrollView>
    </LinearGradient>
  );
}

// Sub-components
function StepBasic({ name, setName, error, onNext }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Basic</ThemedText>
      <ThemedText>Full Name</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder='Enter your name'
        style={styles.input}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
        <ThemedText style={styles.nextText}>Next</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function StepEmail({ email, setEmail, onNext }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Email</ThemedText>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder='example@email.com'
        style={styles.input}
      />
      <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
        <ThemedText style={styles.nextText}>Next</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function StepPass({ password, setPassword, onNext }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Password</ThemedText>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder='••••••••'
        style={styles.input}
      />
      <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
        <ThemedText style={styles.nextText}>Next</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function StepPhoto({ photo, error, onPick, onNext, onSkip }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Profile Photo</ThemedText>
      <TouchableOpacity onPress={onPick} style={styles.avatarWrap}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <ThemedText>📷</ThemedText>
          </View>
        )}
      </TouchableOpacity>
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

function StepLoveQuote({ loveQuote, setLoveQuote, error, onNext, onBack }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Love Quote</ThemedText>
      <TextInput
        value={loveQuote}
        onChangeText={setLoveQuote}
        multiline
        style={[styles.input, { height: 80 }]}
      />
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

function StepDobGender({ dob, setDob, gender, setGender, error, onNext, onBack }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>DOB & Gender</ThemedText>
      <TextInput value={dob} onChangeText={setDob} placeholder='YYYY-MM-DD' style={styles.input} />
      <View style={styles.pills}>
        {['Female', 'Male', 'Non-binary'].map((g: any) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g)}
            style={[styles.pill, gender === g && styles.pillActive]}
          >
            <ThemedText>{g}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
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

function StepSocial({
  instagram,
  setInstagram,
  spotify,
  setSpotify,
  twitter,
  setTwitter,
  onNext,
  onBack,
}: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Socials</ThemedText>
      <TextInput
        value={instagram}
        onChangeText={setInstagram}
        placeholder='Instagram'
        style={styles.input}
      />
      <TextInput
        value={spotify}
        onChangeText={setSpotify}
        placeholder='Spotify'
        style={styles.input}
      />
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

function StepBiometric({ biometricDone, enableBiometric, onNext }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Security</ThemedText>
      <TouchableOpacity
        onPress={biometricDone ? onNext : enableBiometric}
        style={styles.primaryBtn}
      >
        <ThemedText style={styles.primaryBtnText}>
          {biometricDone ? 'Continue' : 'Enable Biometric'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function StepPartnerId({ partnerId, setPartnerId, onFinish, onSkip }: any) {
  return (
    <View style={[styles.card, { width: Dimensions.get('window').width * 0.92 }]}>
      <ThemedText style={styles.title}>Partner ID</ThemedText>
      <TextInput
        value={partnerId}
        onChangeText={setPartnerId}
        placeholder='Enter ID'
        style={styles.input}
      />
      <View style={styles.row}>
        <TouchableOpacity onPress={onSkip}>
          <ThemedText style={styles.linkSmall}>Skip</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onFinish} style={styles.nextBtn}>
          <ThemedText style={styles.nextText}>Finish</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressWrap: { padding: 24, paddingTop: 50 },
  progressText: { fontSize: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: Dimensions.get('window').width * 0.04,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10 },
  nextBtn: { backgroundColor: '#0a7ea4', padding: 12, borderRadius: 8, marginTop: 10 },
  nextText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  error: { color: 'red', fontSize: 12, marginBottom: 5 },
  linkSmall: { color: '#0a7ea4' },
  avatarWrap: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pills: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  pill: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 20 },
  pillActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  primaryBtn: { backgroundColor: '#0a7ea4', padding: 15, borderRadius: 10 },
  primaryBtnText: { color: '#fff', textAlign: 'center' },
});
