// socket/call.socket.js

export default function callSocket(io, socket) {
  // Call user
  socket.on('call_user', ({ toUserId, roomId, caller }) => {
    const targetSocket = io.userSocketMap.get(toUserId);
    if (!targetSocket) return;

    io.to(targetSocket).emit('incoming_call', {
      roomId,
      caller,
    });
  });

  // Accept call
  socket.on('accept_call', ({ roomId }) => {
    socket.join(roomId);
    socket.to(roomId).emit('call_accepted');
  });

  // Reject call
  socket.on('reject_call', ({ toUserId }) => {
    const targetSocket = io.userSocketMap.get(toUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('call_rejected');
    }
  });

  // End call
  socket.on('end_call', ({ roomId }) => {
    socket.to(roomId).emit('call_ended');
    socket.leave(roomId);
  });
}
