import React, { useState } from 'react';
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


type Message = {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  time: string;
};

const messages: Message[] = [
  { id: '1', text: 'I miss you', sender: 'partner', time: '10:30 AM' },
  { id: '2', text: 'I am always with you', sender: 'me', time: '10:32 AM' },
  { id: '3', text: 'When can we talk again?', sender: 'partner', time: '10:35 AM' },
  { id: '4', text: 'How about later tonight?', sender: 'me', time: '10:36 AM' },
  { id: '5', text: 'Perfect! Can not wait', sender: 'partner', time: '10:37 AM' },
];

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const [inputText, setInputText] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <LinearGradient
        colors={['#FFF5F8', '#F0F9FF']}
        style={styles.background}
      >
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

        {/* CHAT AREA */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.chatContent, isLarge && styles.chatContentLarge]}
          inverted
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'me' ? styles.myMessage : styles.partnerMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'me' ? styles.myMessageText : styles.partnerMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === 'me' ? styles.myMessageTime : styles.partnerMessageTime,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* AI EMOTION INDICATOR */}
        <View style={styles.emotionBubble}>
          <View style={styles.emotionDot} />
          <Text style={styles.emotionText}>Loving mood</Text>
        </View>

        {/* INPUT BAR */}
        <View style={[styles.inputBar, isLarge && styles.inputBarLarge]}>
          <TouchableOpacity style={styles.inputIcon}>
            <Mic size={22} color='#6B7280' />
          </TouchableOpacity>

          <TextInput
            placeholder='Type your message...'
            placeholderTextColor='#9CA3AF'
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity style={styles.inputIcon}>
            <Smile size={22} color='#6B7280' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton}>
            <LinearGradient
              colors={['#FF6B9D', '#FF8FB3']}
              style={styles.sendGradient}
            >
              <Send size={18} color='#fff' />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerStatus: {
    fontSize: 13,
    color: '#10B981',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatContentLarge: {
    paddingHorizontal: 120,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B9D',
    borderBottomRightRadius: 4,
  },
  partnerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  partnerMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-end',
  },
  partnerMessageTime: {
    color: '#9CA3AF',
  },
  emotionBubble: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 100 : 115,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B9D',
  },
  emotionText: {
    fontSize: 13,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  inputBarLarge: {
    marginHorizontal: 120,
    borderRadius: 24,
    marginBottom: 12,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    padding: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 8 : 10,
    fontSize: 15,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    color: '#1F2937',
  },
  sendButton: {
    borderRadius: 20,
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
