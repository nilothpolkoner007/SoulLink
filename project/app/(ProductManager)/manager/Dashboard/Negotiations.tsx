import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

interface Message {
  from: 'buyer' | 'manager';
  text: string;
  time: string;
}

interface Negotiation {
  id: string;
  product: string;
  buyer: string;
  lastMessage: string;
  status: 'pending' | 'accepted' | 'rejected';
  unread: number;
  messages: Message[];
}

const mockNegotiations: Negotiation[] = [
  {
    id: 'N-1001',
    product: 'Organic Turmeric Powder',
    buyer: 'Rafi',
    lastMessage: 'Can you do 200/kg?',
    status: 'pending',
    unread: 2,
    messages: [
      { from: 'buyer', text: 'Hi, any discount for bulk?', time: '10:02 AM' },
      { from: 'manager', text: 'We can discuss price for 10+ kg.', time: '10:05 AM' },
      { from: 'buyer', text: 'Can you do 200/kg?', time: '10:12 AM' },
    ],
  },
  {
    id: 'N-1002',
    product: 'Stainless Steel Bottle',
    buyer: 'Maya',
    lastMessage: 'Send sample pics',
    status: 'accepted',
    unread: 0,
    messages: [
      { from: 'buyer', text: 'Please send pics of sample.', time: 'Yesterday' },
      { from: 'manager', text: 'Attached samples sent.', time: 'Yesterday' },
    ],
  },
];

const Negotiations: React.FC = () => {
  const [list, setList] = useState<Negotiation[]>(mockNegotiations);
  const [activeId, setActiveId] = useState<string>(list[0]?.id || '');
  const [messageText, setMessageText] = useState<string>('');
  const scrollRef = useRef<ScrollView | null>(null);

  const active = list.find((n) => n.id === activeId);

  const sendMessage = () => {
    if (!messageText.trim() || !activeId) return;
    setList((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, { from: 'manager', text: messageText.trim(), time: 'Now' }],
              lastMessage: messageText.trim(),
            }
          : c,
      ),
    );
    setMessageText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const updateStatus = (status: 'pending' | 'accepted' | 'rejected') => {
    if (!activeId) return;
    setList((prev) => prev.map((c) => (c.id === activeId ? { ...c, status } : c)));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Negotiations</Text>
        <Text style={styles.headerSub}>Manage buyer negotiations, chat and update status</Text>
      </View>

      <View style={styles.body}>
        {/* Left List */}
        <View style={styles.list}>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.listItem, item.id === activeId ? styles.activeListItem : undefined]}
                onPress={() => setActiveId(item.id)}
              >
                <View>
                  <Text style={styles.listTitle}>{item.product}</Text>
                  <Text style={styles.listSub}>
                    {item.buyer} · {item.id}
                  </Text>
                </View>
                <View style={styles.listRight}>
                  <Text style={styles.listLast}>{item.lastMessage}</Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'accepted' && styles.statusAccepted,
                      item.status === 'rejected' && styles.statusRejected,
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Right Thread */}
        <View style={styles.thread}>
          {active ? (
            <>
              <View style={styles.threadHeader}>
                <View>
                  <Text style={styles.threadTitle}>{active.product}</Text>
                  <Text style={styles.threadSub}>
                    {active.buyer} · {active.id}
                  </Text>
                </View>
                <View style={styles.threadActions}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => updateStatus('accepted')}
                  >
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => updateStatus('rejected')}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                ref={scrollRef}
                style={styles.messages}
                contentContainerStyle={{ paddingBottom: 12 }}
              >
                {active.messages.map((m, i) => (
                  <View
                    key={i}
                    style={[styles.message, m.from === 'manager' ? styles.outMsg : styles.inMsg]}
                  >
                    <Text style={[styles.msgText, m.from === 'manager' && { color: 'white' }]}>
                      {m.text}
                    </Text>
                    <Text style={styles.msgTime}>{m.time}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.composer}>
                <TextInput
                  placeholder='Write a message...'
                  value={messageText}
                  onChangeText={setMessageText}
                  style={styles.input}
                  onSubmitEditing={sendMessage}
                  returnKeyType='send'
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                  <Text style={styles.btnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyThread}>
              <Text>Select a negotiation to view messages</Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  headerSub: { color: '#6B7280', fontSize: 13, marginTop: 4 },

  body: { flex: 1, flexDirection: 'row' },
  list: { width: 300, borderRightWidth: 1, borderColor: '#E6E9EE', backgroundColor: '#fff' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#E6E9EE',
  },
  activeListItem: { backgroundColor: '#EFF6FF' },
  listTitle: { fontWeight: '700', fontSize: 14, color: '#0f172a' },
  listSub: { fontSize: 12, color: '#6B7280' },
  listRight: { alignItems: 'flex-end' },
  listLast: { fontSize: 12, color: '#6B7280' },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadText: { color: 'white', fontSize: 12, fontWeight: '700' },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  statusAccepted: { backgroundColor: '#DCFCE7' },
  statusRejected: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, textTransform: 'capitalize', color: '#6B7280' },

  thread: { flex: 1, backgroundColor: '#fff' },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E6E9EE',
  },
  threadTitle: { fontSize: 16, fontWeight: 'bold' },
  threadSub: { fontSize: 12, color: '#6B7280' },
  threadActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: { color: 'white', fontWeight: '700' },

  messages: { flex: 1, padding: 12 },
  message: { maxWidth: '78%', padding: 10, borderRadius: 12, marginVertical: 4 },
  inMsg: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start' },
  outMsg: { backgroundColor: '#2563EB', alignSelf: 'flex-end' },
  msgText: { color: '#0f172a' },
  msgTime: { fontSize: 11, color: '#6B7280', marginTop: 4, alignSelf: 'flex-end' },

  composer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#E6E9EE',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyThread: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Negotiations;
