// socket/emoji.socket.js

export default function emojiSocket(io, socket) {
  // Live emoji reaction
  socket.on('send_emoji', ({ roomId, emoji }) => {
    io.to(roomId).emit('receive_emoji', emoji);
  });

  // Emotion data from AI (future)
  socket.on('send_emotion', ({ roomId, emotion, confidence }) => {
    io.to(roomId).emit('receive_emotion', {
      emotion,
      confidence,
      time: Date.now(),
    });
  });
}
