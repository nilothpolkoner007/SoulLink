// socket/user.socket.js

export default function userSocket(io, socket) {
  // Register user with socket
  socket.on('register_user', ({ userId }) => {
    if (!userId) return;

    io.userSocketMap.set(userId, socket.id);

    // Notify others user is online
    socket.broadcast.emit('user_online', { userId });
  });

  // User disconnect
  socket.on('disconnect', () => {
    for (const [userId, socketId] of io.userSocketMap.entries()) {
      if (socketId === socket.id) {
        io.userSocketMap.delete(userId);
        socket.broadcast.emit('user_offline', { userId });
        break;
      }
    }
  });
}
