import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { sha256 } from 'crypto-js';

// ------------------- Helper: Generate Couple ID -------------------
const generateCoupleId = (userId1: string, userId2: string) => {
  if (!userId1 || !userId2) throw new Error('Both IDs required');
  const [idA, idB] = [userId1, userId2].sort();
  const combined = idA + '_' + idB;
  return sha256(combined).toString().substring(0, 12); // 12-char hash
};

export default function PartnerConnectScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [partnerIdInput, setPartnerIdInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const { width, height } = useWindowDimensions();
  const isDesktop = width > 768;

  // ------------------- Helper: Status Check -------------------
  const checkStatus = async (uid: string) => {
    const doc = await db.collection('users').doc(uid).get();
    const data = doc.data();
    return data?.status || 'single';
  };

  // ------------------- Connect with Partner ID -------------------
  const handleConnectWithId = async () => {
    if (!user || partnerIdInput.trim().length === 0) return;
    setLoading(true);

    const query = await db.collection('users').where('coupleId', '==', partnerIdInput).get();

    if (query.empty) {
      alert('No user found with that code 💔');
      setLoading(false);
      return;
    }

    const partnerDoc = query.docs[0];
    const partnerStatus = await checkStatus(partnerDoc.id);

    if (partnerStatus === 'connected') {
      alert('That user is already connected 😕');
      setLoading(false);
      return;
    }

    // Generate deterministic couple ID
    const coupleId = generateCoupleId(user.uid, partnerDoc.id);

    // Update both users
    await db.collection('users').doc(user.uid).update({
      partnerId: partnerDoc.id,
      status: 'connected',
      coupleId,
    });

    await db.collection('users').doc(partnerDoc.id).update({
      partnerId: user.uid,
      status: 'connected',
      coupleId,
    });

    setLoading(false);

    navigation.navigate('TwoHeartsConnecting', {
      partnerId: partnerDoc.id,
      coupleId,
    });
  };

  // ------------------- Search Partner Function -------------------
  const handleSearch = async () => {
    if (!search) return;
    const query = await db
      .collection('users')
      .where('name', '>=', search)
      .where('name', '<=', search + '\uf8ff')
      .get();

    setResults(query.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })));
  };

  // ------------------- Modal Item Component -------------------
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => {
        setPartnerIdInput(item.coupleId);
        setModalVisible(false);
      }}
    >
      <Image source={{ uri: item.photoURL }} style={styles.avatar} />
      <Text style={[styles.name, { fontSize: isDesktop ? 18 : 16 }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const containerPadding = isDesktop ? 40 : 20;
  const buttonWidth = isDesktop ? 300 : '80%';
  const inputWidth = isDesktop ? 300 : '80%';

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: containerPadding }]}>
      <Text style={[styles.title, { fontSize: isDesktop ? 28 : 24 }]}>Connect Your Heart 💞</Text>

      <TextInput
        style={[styles.input, { width: inputWidth, fontSize: isDesktop ? 18 : 16 }]}
        placeholder='Enter Partner’s ID'
        value={partnerIdInput}
        onChangeText={setPartnerIdInput}
      />

      <TouchableOpacity
        style={[styles.button, { width: buttonWidth }]}
        onPress={handleConnectWithId}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text style={styles.buttonText}>Connect</Text>
        )}
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.button, { backgroundColor: '#FF85A2', width: buttonWidth }]}
        >
          <Text style={styles.buttonText}>Search Partner by Name / Face</Text>
        </TouchableOpacity>
      </View>

      {/* ------------------- Modal ------------------- */}
      <Modal
        visible={modalVisible}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { padding: containerPadding, minHeight: height },
          ]}
        >
          <Text style={[styles.title, { fontSize: isDesktop ? 28 : 24 }]}>Search Partner 🔍</Text>

          <TextInput
            style={[styles.input, { width: inputWidth, fontSize: isDesktop ? 18 : 16 }]}
            placeholder='Enter name...'
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ marginTop: 10, maxHeight: isDesktop ? 400 : height * 0.4 }}
          />

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={[styles.button, { backgroundColor: '#ccc', marginTop: 20, width: buttonWidth }]}
          >
            <Text style={[styles.buttonText, { color: '#333' }]}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: Platform.OS === 'ios' ? 14 : 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FF6F91',
    padding: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  separator: { marginVertical: 10 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 99 },
  name: { marginLeft: 10 },
});
