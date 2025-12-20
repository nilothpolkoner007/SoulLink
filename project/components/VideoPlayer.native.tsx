import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Video } from 'expo-av';

interface Props {
  stream?: any; // Keep for compatibility, but we'll use Expo AV
  source?: any; // Add source prop for Expo AV
}

const VideoPlayer = ({ stream, source }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Video Calling Feature</Text>
      <Text style={styles.subText}>WebRTC functionality requires native development build</Text>
      <Text style={styles.subText}>Use Expo AV for basic video playback</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default VideoPlayer;
