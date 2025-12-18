import { Server } from 'socket.io';
import ChatBundle from '../module/ChatMessage.js';

const userSocketMap = new Map();
let ioInstance;

const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('🟢 Connected:', socket.id);

    /* ===== USER REGISTER ===== */
    socket.on('register_user', ({ userId }) => {
      userSocketMap.set(userId, socket.id);
    });

    /* ===== CHAT ===== */
    socket.on('join_chat', ({ roomId }) => socket.join(roomId));

    socket.on('send_message', async ({ roomId, message }) => {
      let bundle = await ChatBundle.findOne({
        roomId,
        sender_id: message.sender_id,
      });

      if (!bundle) {
        bundle = await ChatBundle.create({
          roomId,
          sender_id: message.sender_id,
          messages: [],
        });
      }

      bundle.messages.push({
        content: message.content,
        created_at: message.created_at,
      });

      await bundle.save();
      socket.to(roomId).emit('receive_message', message);
    });

    /* ===== VIDEO CALL ===== */
    socket.on('call_user', ({ toUserId, roomId, caller }) => {
      const target = userSocketMap.get(toUserId);
      if (target) io.to(target).emit('incoming_call', { roomId, caller });
    });

    socket.on('accept_call', ({ roomId }) => {
      socket.join(roomId);
      socket.to(roomId).emit('call_accepted');
    });

    socket.on('end_call', ({ roomId }) => {
      socket.to(roomId).emit('call_ended');
      socket.leave(roomId);
    });

    /* ===== WEBRTC ===== */
    socket.on('webrtc_offer', (d) => socket.to(d.roomId).emit('webrtc_offer', d.offer));
    socket.on('webrtc_answer', (d) => socket.to(d.roomId).emit('webrtc_answer', d.answer));
    socket.on('webrtc_ice', (d) => socket.to(d.roomId).emit('webrtc_ice', d.candidate));

    /* ===== EMOJI ===== */
    socket.on('send_emoji', ({ roomId, emoji }) => {
      io.to(roomId).emit('receive_emoji', { emoji });
    });

    socket.on('disconnect', () => {
      for (const [k, v] of userSocketMap.entries()) {
        if (v === socket.id) userSocketMap.delete(k);
      }
    });
  });
};

export const getSocketIO = () => ioInstance;
export default setupChatSocket;
