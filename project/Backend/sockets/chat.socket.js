import ChatBundle from '../module/ChatMessage.js';

export default function chatSocket(io, socket) {
  // Join chat room
  socket.on('join_chat', ({ roomId }) => {
    socket.join(roomId);
  });

  // Send message
  socket.on('send_message', async ({ roomId, message }) => {
    if (!roomId || !message?.content) return;

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

      // Broadcast message
      socket.to(roomId).emit('receive_message', message);
    } catch (error) {
      console.error('Message send error:', error);
    }
  });
}
