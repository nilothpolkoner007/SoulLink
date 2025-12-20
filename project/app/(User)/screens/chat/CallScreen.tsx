import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useNavigation, useRoute } from '@react-navigation/native';

const CallScreen = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, incoming, connected
  const [caller, setCaller] = useState(null);
  const [roomId, setRoomId] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { toUserId, isIncoming } = route.params || {};

  useEffect(() => {
    // Connect to socket server
    const newSocket = io('http://localhost:5000'); // Adjust URL as needed
    setSocket(newSocket);

    // Register user
    newSocket.emit('register_user', { userId: 'currentUserId' }); // Replace with actual user ID

    // Listen for incoming calls
    newSocket.on('incoming_call', ({ roomId, caller }) => {
      setCallStatus('incoming');
      setCaller(caller);
      setRoomId(roomId);
    });

    // Listen for call accepted
    newSocket.on('call_accepted', () => {
      setCallStatus('connected');
      // Navigate to video call screen
      navigation.navigate('VideoCallScreen', { roomId });
    });

    // Listen for call rejected
    newSocket.on('call_rejected', () => {
      setCallStatus('idle');
      Alert.alert('Call Rejected', 'The call was rejected.');
    });

    // Listen for call ended
    newSocket.on('call_ended', () => {
      setCallStatus('idle');
      Alert.alert('Call Ended', 'The call has ended.');
      navigation.goBack();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const initiateCall = () => {
    if (!socket || !toUserId) return;
    const callRoomId = `call_${Date.now()}`;
    setRoomId(callRoomId);
    setCallStatus('calling');
    socket.emit('call_user', {
      toUserId,
      roomId: callRoomId,
      caller: { id: 'currentUserId', name: 'Your Name' }, // Replace with actual data
    });
  };

  const acceptCall = () => {
    if (!socket || !roomId) return;
    socket.emit('accept_call', { roomId });
  };

  const rejectCall = () => {
    if (!socket) return;
    socket.emit('reject_call', { toUserId: caller.id });
    setCallStatus('idle');
  };

  const endCall = () => {
    if (!socket || !roomId) return;
    socket.emit('end_call', { roomId });
    setCallStatus('idle');
    navigation.goBack();
  };

  if (callStatus === 'incoming') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Incoming Call</Text>
        <Text style={styles.caller}>{caller?.name || 'Unknown'}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton} onPress={acceptCall}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={rejectCall}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (callStatus === 'calling') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calling...</Text>
        <TouchableOpacity style={styles.endButton} onPress={endCall}>
          <Text style={styles.buttonText}>End Call</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (callStatus === 'connected') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Call Connected</Text>
        <TouchableOpacity style={styles.endButton} onPress={endCall}>
          <Text style={styles.buttonText}>End Call</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Call Screen</Text>
      <TouchableOpacity style={styles.callButton} onPress={initiateCall}>
        <Text style={styles.buttonText}>Call User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  caller: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: 100,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    width: 100,
  },
  endButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CallScreen;
