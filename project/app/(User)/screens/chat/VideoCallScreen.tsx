import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { io, Socket } from 'socket.io-client';

const { width, height } = Dimensions.get('window');

interface VideoCallProps {
  localStream?: any;
  remoteStream?: any;
  onToggleAudio?: (enabled: boolean) => void;
  onToggleVideo?: (enabled: boolean) => void;
  onEndCall?: () => void;
  callStatus?: string;
  remoteUsername?: string;
  roomId?: string;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
}

const EMOJIS = ['❤️', '😄', '😢', '🔥', '😘'];

export default function VideoCallScreen({
  onEndCall,
  callStatus = 'connecting',
  remoteUsername = 'User',
  roomId = 'room1',
}: VideoCallProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    // Connect to socket server for emoji functionality
    const newSocket = io('http://192.168.31.91:5000'); // Use your backend IP
    setSocket(newSocket);

    // Register user and join room for emoji sharing
    newSocket.emit('register_user', { userId: 'currentUserId' });
    newSocket.emit('join_chat', { userId: 'currentUserId', roomId });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_emoji', ({ emoji }) => {
      const id = Math.random().toString();
      setFloatingEmojis((prev) => [...prev, { id, emoji }]);

      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 2000);
    });

    return () => {
      socket.off('receive_emoji');
    };
  }, [socket]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const sendEmoji = (emoji: string) => {
    if (!socket) return;
    socket.emit('send_emoji', { roomId, emoji });
  };

  return (
    <View style={styles.container}>
      {/* Video Placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.remoteVideo}>
          <Text style={styles.placeholderText}>Video Call</Text>
          <Text style={styles.statusText}>{callStatus}</Text>
          <Text style={styles.usernameText}>{remoteUsername}</Text>
        </View>

        <View style={styles.localVideo}>
          <Text style={styles.localText}>You</Text>
        </View>
      </View>

      {/* Floating Emojis */}
      {floatingEmojis.map((emoji) => (
        <Animated.View
          key={emoji.id}
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.floatingEmoji}
        >
          <Text style={styles.emojiText}>{emoji.emoji}</Text>
        </Animated.View>
      ))}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, !audioEnabled && styles.disabledButton]}
          onPress={toggleAudio}
        >
          <Text style={styles.controlText}>🎤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !videoEnabled && styles.disabledButton]}
          onPress={toggleVideo}
        >
          <Text style={styles.controlText}>📹</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={onEndCall}>
          <Text style={styles.endCallText}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Emoji Panel */}
      <View style={styles.emojiPanel}>
        {EMOJIS.map((emoji) => (
          <TouchableOpacity key={emoji} style={styles.emojiButton} onPress={() => sendEmoji(emoji)}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10,
  },
  usernameText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 5,
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  localText: {
    color: '#fff',
    fontSize: 14,
  },
  floatingEmoji: {
    position: 'absolute',
    top: height / 2 - 50,
    left: width / 2 - 25,
  },
  emojiText: {
    fontSize: 40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  controlText: {
    fontSize: 24,
  },
  endCallButton: {
    backgroundColor: '#ff4444',
  },
  endCallText: {
    fontSize: 24,
  },
  emojiPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  emojiButton: {
    padding: 10,
  },
});
