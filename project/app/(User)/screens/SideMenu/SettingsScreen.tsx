import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  ScrollView,
} from 'react-native';

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(true);

  const biometricRecheck = () => {
    Alert.alert('Biometric Check', 'Fingerprint / Face ID verification required.');
  };

  const recoverAccount = () => {
    Alert.alert('Account Recovery', 'Recovery email has been sent.');
  };

  const deleteAccount = () => {
    Alert.alert('Delete Account', 'This will permanently delete your account and all data.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={[styles.container, isLargeScreen && styles.containerLarge]}>
        <Text style={styles.title}>⚙️ Settings</Text>

        {/* Notification Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔔 Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Enable Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
        </View>

        {/* Privacy Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Privacy</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Private Account</Text>
            <Switch value={privateAccount} onValueChange={setPrivateAccount} />
          </View>
        </View>

        {/* Biometric Re-check */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧬 Security</Text>
          <TouchableOpacity style={styles.button} onPress={biometricRecheck}>
            <Text style={styles.buttonText}>Biometric Re-check</Text>
          </TouchableOpacity>
        </View>

        {/* Account Recovery */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>♻️ Account Recovery</Text>
          <TouchableOpacity style={styles.button} onPress={recoverAccount}>
            <Text style={styles.buttonText}>Recover Account</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account */}
        <View style={[styles.card, styles.dangerCard]}>
          <Text style={styles.cardTitle}>🗑️ Danger Zone</Text>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteAccount}>
            <Text style={styles.deleteText}>Delete Account Permanently</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 40,
  },
  container: {
    padding: 16,
  },
  containerLarge: {
    width: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff7eb3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
