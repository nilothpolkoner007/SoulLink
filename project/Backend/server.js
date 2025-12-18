import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import connectDB from './conectdb/db.js';

// Routes
import userRouter from './router/userRouter.js';
import milestoneRouter from './router/milestoneRouter.js';
import chatRoutes from './router/chat.js';
import uplodRouter from './router/uplodRouter.js';
import productRoutes from './router/productRoutes.js';
import eventplaceRoutes from './router/eventplaceRoutes.js';
import eventRoutes from './router/event.js';

// Socket setup
import setupChatSocket from './router/chatSocket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Database
connectDB();

// 🔹 Middleware (IMPORTANT FOR REACT NATIVE)
app.use(
  cors({
    origin: '*', // React Native has no domain
    methods: ['GET', 'POST'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Test Route
app.get('/', (req, res) => {
  res.send('🚀 Backend running for React Native');
});

// 🔹 API Routes
app.use('/user', userRouter);
app.use('/api/couple-profile', milestoneRouter);
app.use('/chat', chatRoutes);
app.use('/upload', uplodRouter);
app.use('/api/products', productRoutes);
app.use('/api/eventplaces', eventplaceRoutes);
app.use('/api/events', eventRoutes);

// 🔹 Static uploads
app.use('/uploads', express.static('uploads'));

// 🔹 Create HTTP Server (MANDATORY FOR SOCKET.IO)
const server = http.createServer(app);

// 🔹 Initialize Socket.IO (Chat + Video Call)
setupChatSocket(server);

// 🔹 Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
