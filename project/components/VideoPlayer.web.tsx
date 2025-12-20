import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface Props {
  stream: MediaStream | null;
}

const VideoPlayer = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return <Text>No Web Stream</Text>;

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default VideoPlayer;
