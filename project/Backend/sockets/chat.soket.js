// socket/chat.socket.js

import Chat from '../models/Chat.js';

export default function chatSocket(io, socket) {
  // Join chat room
  socket.on('join_chat', ({ roomId }) => {
    socket.join(roomId);
  });

  // Send message
  socket.on('send_message', async ({ roomId, message }) => {
    if (!roomId || !message) return;

    // Save message
    await Chat.create({
      roomId,
      sender_id: message.sender_id,
      messages: [{ content: message.content }],
    });

    // Broadcast message
    io.to(roomId).emit('receive_message', message);
  });
}
