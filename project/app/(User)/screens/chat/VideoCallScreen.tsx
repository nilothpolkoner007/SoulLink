import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { RTCView, MediaStream } from 'react-native-webrtc';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { io, Socket } from 'socket.io-client';
 // your socket instance

const { width, height } = Dimensions.get('window');

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onToggleAudio: (enabled: boolean) => void;
  onToggleVideo: (enabled: boolean) => void;
  onEndCall: () => void;
  callStatus: string;
  remoteUsername?: string;
  roomId: string;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
}

const EMOJIS = ['❤️', '😄', '😢', '🔥', '😘'];

export default function VideoCallScreen({
  localStream,
  remoteStream,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  callStatus,
  remoteUsername,
  roomId,
}: VideoCallProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  /* ================= SOCKET EMOJI RECEIVE ================= */

  useEffect(() => {
    socket.on('receive-emoji', ({ emoji }) => {
      const id = Math.random().toString();
      setFloatingEmojis((prev) => [...prev, { id, emoji }]);

      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 2000);
    });

    return () => {
      socket.off('receive-emoji');
    };
  }, []);

  /* ================= HANDLERS ================= */

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    onToggleAudio(newState);
  };

  const toggleVideo = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);
    onToggleVideo(newState);
  };

  const sendEmoji = (emoji: string) => {
    socket.emit('send-emoji', { roomId, emoji });
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* Remote Video */}
      {remoteStream ? (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} objectFit='cover' />
      ) : (
        <View style={styles.waiting}>
          <Text style={styles.waitingText}>{callStatus}</Text>
          {remoteUsername && <Text style={styles.subText}>Calling {remoteUsername}…</Text>}
        </View>
      )}

      {/* Local Video */}
      <View style={styles.localContainer}>
        {localStream && videoEnabled ? (
          <RTCView streamURL={localStream.toURL()} style={styles.localVideo} objectFit='cover' />
        ) : (
          <View style={styles.videoOff}>
            <Text style={styles.videoOffText}>📷 OFF</Text>
          </View>
        )}
        <Text style={styles.youLabel}>You</Text>
      </View>

      {/* Floating Emojis */}
      {floatingEmojis.map((item) => (
        <Animated.Text
          key={item.id}
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.floatingEmoji}
        >
          {item.emoji}
        </Animated.Text>
      ))}

      {/* Emoji Reaction Bar */}
      <View style={styles.emojiBar}>
        {EMOJIS.map((emoji) => (
          <TouchableOpacity key={emoji} onPress={() => sendEmoji(emoji)} style={styles.emojiBtn}>
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Call Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={toggleAudio}
          style={[styles.controlBtn, !audioEnabled && styles.redBtn]}
        >
          <Text style={styles.controlText}>{audioEnabled ? '🎙️' : '🔇'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleVideo}
          style={[styles.controlBtn, !videoEnabled && styles.redBtn]}
        >
          <Text style={styles.controlText}>{videoEnabled ? '📹' : '🚫'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onEndCall} style={[styles.controlBtn, styles.endBtn]}>
          <Text style={styles.controlText}>📞❌</Text>
        </TouchableOpacity>
      </View>

      {/* Username */}
      {remoteUsername && (
        <View style={styles.nameTag}>
          <Text style={styles.nameText}>{remoteUsername}</Text>
        </View>
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  remoteVideo: {
    width,
    height,
    position: 'absolute',
  },

  waiting: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  waitingText: {
    color: '#fff',
    fontSize: 20,
  },

  subText: {
    color: '#ccc',
    marginTop: 8,
  },

  localContainer: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },

  localVideo: {
    width: '100%',
    height: '100%',
  },

  videoOff: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },

  videoOffText: {
    color: '#fff',
  },

  youLabel: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    borderRadius: 6,
  },

  controls: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  controlBtn: {
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 40,
  },

  redBtn: {
    backgroundColor: '#C62828',
  },

  endBtn: {
    backgroundColor: '#E53935',
  },

  controlText: {
    fontSize: 22,
    color: '#fff',
  },

  emojiBar: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 30,
  },

  emojiBtn: {
    marginHorizontal: 6,
  },

  emoji: {
    fontSize: 26,
  },

  floatingEmoji: {
    position: 'absolute',
    bottom: height / 2,
    alignSelf: 'center',
    fontSize: 48,
  },

  nameTag: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  nameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
