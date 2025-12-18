// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import connectDB from './conectdb/db.js';

// Routes
import userRouter from './router/userRouter.js';
import milestoneRouter from './router/milestoneRouter.js';
import chatRoutes from './router/chat.js';
import uploadRouter from './router/uplodRouter.js';
import productRoutes from './router/productRoutes.js';
import eventplaceRoutes from './router/eventplaceRoutes.js';
import eventRoutes from './router/event.js';

// Socket core
import { Server } from 'socket.io';

// Socket modules
import userSocket from './sockets/user.socket.js';
import chatSocket from './sockets/chat.socket.js';
import callSocket from './sockets/call.socket.js';
import webrtcSocket from './sockets/webrtc.socket.js';
import emojiSocket from './sockets/emoji.socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== DATABASE ===================== */
connectDB();

/* ===================== MIDDLEWARE ===================== */
app.use(
  cors({
    origin: '*', // React Native safe
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== ROUTES ===================== */
app.get('/', (req, res) => {
  res.send('🚀 SoulLink Backend Running');
});

app.use('/user', userRouter);
app.use('/api/couple-profile', milestoneRouter);
app.use('/chat', chatRoutes);
app.use('/upload', uploadRouter);
app.use('/api/products', productRoutes);
app.use('/api/eventplaces', eventplaceRoutes);
app.use('/api/events', eventRoutes);

// Static uploads
app.use('/uploads', express.static('uploads'));

/* ===================== HTTP SERVER ===================== */
const server = http.createServer(app);

/* ===================== SOCKET.IO ===================== */
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Global user map
io.userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // Register socket modules
  userSocket(io, socket);
  chatSocket(io, socket);
  callSocket(io, socket);
  webrtcSocket(io, socket);
  emojiSocket(io, socket);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

/* ===================== START SERVER ===================== */
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
