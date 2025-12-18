import { io, Socket } from 'socket.io-client';
import ChatBundle from ',../../../../models/Chat';

const userSocketMap = new Map();
let ioInstance = null;

const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('✅ Socket.IO initialized');

  ioInstance = io;
  io.userSocketMap = userSocketMap;

  io.on('connection', (socket) => {
    console.log('✅ New socket connected:', socket.id);

    /* ================= USER REGISTER ================= */

    socket.on('register_user', ({ userId }) => {
      userSocketMap.set(userId, socket.id);
      console.log(`🔗 User ${userId} linked to socket ${socket.id}`);
    });

    /* ================= CHAT ================= */

    socket.on('join_chat', ({ userId, roomId }) => {
      socket.join(roomId);
      console.log(`👥 ${userId} joined room ${roomId}`);
    });

    socket.on('send_message', async ({ roomId, message }) => {
      if (!roomId || !message) return;

      try {
        const existing = await ChatBundle.findOne({
          roomId,
          sender_id: message.sender_id,
        });

        if (existing) {
          existing.messages.push({
            content: message.content,
            created_at: message.created_at,
          });
          await existing.save();
        } else {
          await ChatBundle.create({
            roomId,
            sender_id: message.sender_id,
            messages: [
              {
                content: message.content,
                created_at: message.created_at,
              },
            ],
          });
        }

        socket.to(roomId).emit('receive_message', message);
      } catch (err) {
        console.error('❌ Chat save failed:', err);
      }
    });

    /* ================= VIDEO CALL ================= */

    // Call request
    socket.on('call_user', ({ toUserId, roomId, caller }) => {
      const targetSocket = userSocketMap.get(toUserId);
      if (targetSocket) {
        io.to(targetSocket).emit('incoming_call', {
          roomId,
          caller,
        });
      }
    });

    // Call accepted
    socket.on('accept_call', ({ roomId }) => {
      socket.join(roomId);
      socket.to(roomId).emit('call_accepted');
    });

    // Call rejected
    socket.on('reject_call', ({ toUserId }) => {
      const targetSocket = userSocketMap.get(toUserId);
      if (targetSocket) {
        io.to(targetSocket).emit('call_rejected');
      }
    });

    // End call
    socket.on('end_call', ({ roomId }) => {
      socket.to(roomId).emit('call_ended');
      socket.leave(roomId);
    });

    /* ================= WEBRTC SIGNALING ================= */

    socket.on('webrtc_offer', ({ roomId, offer }) => {
      socket.to(roomId).emit('webrtc_offer', offer);
    });

    socket.on('webrtc_answer', ({ roomId, answer }) => {
      socket.to(roomId).emit('webrtc_answer', answer);
    });

    socket.on('webrtc_ice', ({ roomId, candidate }) => {
      socket.to(roomId).emit('webrtc_ice', candidate);
    });

    /* ================= EMOJI REACTION ================= */

    socket.on('send_emoji', ({ roomId, emoji }) => {
      io.to(roomId).emit('receive_emoji', {
        emoji,
        sender: socket.id,
        time: Date.now(),
      });
    });

    /* ================= DISCONNECT ================= */

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected:', socket.id);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`❌ Removed user ${userId}`);
        }
      }
    });
  });
};

// Access Socket.IO instance elsewhere
export const getSocketIO = () => ioInstance;

export default setupChatSocket;
