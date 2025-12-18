import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Video, MoreVertical, Mic, Smile, Send } from 'lucide-react-native';
import { io, Socket } from 'socket.io-client';

/* ================= CONFIG ================= */

const SOCKET_URL = 'http://YOUR_SERVER_IP:5000'; // 🔴 CHANGE THIS
const API_URL = 'http://YOUR_SERVER_IP:5000';

/* ================= TYPES ================= */

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

/* ================= COMPONENT ================= */

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  const socketRef = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const userId = 'USER_1'; // 🔴 real logged-in user
  const roomId = 'ROOM_123'; // 🔴 chat room id
  const partnerId = 'USER_2'; // 🔴 partner user id

  /* ================= SOCKET SETUP ================= */

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current.emit('register_user', { userId });
    socketRef.current.emit('join_chat', { roomId });

    socketRef.current.on('receive_message', (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* ================= LOAD CHAT HISTORY ================= */

  useEffect(() => {
    fetch(`${API_URL}/chat/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.reverse());
      });
  }, []);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender_id: userId,
      created_at: new Date().toISOString(),
    };

    socketRef.current?.emit('send_message', {
      roomId,
      message,
    });

    setMessages((prev) => [message, ...prev]);
    setInputText('');
  };

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient colors={['#FFF5F8', '#F0F9FF']} style={styles.background}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>P</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Partner</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Phone size={20} color='#FF6B9D' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Video size={20} color='#FF6B9D' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MoreVertical size={20} color='#6B7280' />
            </TouchableOpacity>
          </View>
        </View>

        {/* CHAT */}
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.chatContent, isLarge && styles.chatContentLarge]}
          renderItem={({ item }) => {
            const isMe = item.sender_id === userId;

            return (
              <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.partnerMessage]}>
                <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                  {item.content}
                </Text>
                <Text style={styles.messageTime}>
                  {new Date(item.created_at).toLocaleTimeString()}
                </Text>
              </View>
            );
          }}
        />

        {/* INPUT */}
        <View style={[styles.inputBar, isLarge && styles.inputBarLarge]}>
          <TouchableOpacity style={styles.inputIcon}>
            <Mic size={22} color='#6B7280' />
          </TouchableOpacity>

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder='Type your message...'
            style={styles.input}
            multiline
          />

          <TouchableOpacity style={styles.inputIcon}>
            <Smile size={22} color='#6B7280' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <LinearGradient colors={['#FF6B9D', '#FF8FB3']} style={styles.sendGradient}>
              <Send size={18} color='#fff' />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerStatus: { fontSize: 13, color: '#10B981' },
  headerIcons: { flexDirection: 'row' },
  iconButton: { padding: 8 },
  chatContent: { padding: 16 },
  chatContentLarge: { paddingHorizontal: 120 },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '75%',
  },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#FF6B9D' },
  partnerMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  messageText: { fontSize: 15 },
  myMessageText: { color: '#fff' },
  messageTime: { fontSize: 11, opacity: 0.7 },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  inputBarLarge: { marginHorizontal: 120, borderRadius: 24 },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  inputIcon: { padding: 6 },
  sendButton: { marginLeft: 6 },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
