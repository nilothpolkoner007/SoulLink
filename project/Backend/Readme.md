🌐 Soul Link – Backend Server

A Node.js + Express + Socket.IO backend built to power the Soul Link mobile application.
The backend supports real-time chat, 1-to-1 video call signaling, emoji reactions, emotion data streaming, and relationship-based features like milestones and mood tracking.

🚀 Features
🔐 User & Profile

User authentication & management

Couple profile & relationship milestones

Secure MongoDB storage using Mongoose

💬 Real-Time Chat

1-to-1 chat rooms

Message bundling per user

Persistent message storage

Socket.IO powered

📞 Video Call (WebRTC Signaling)

One-to-one call rooms

WebRTC offer / answer exchange

ICE candidate signaling

Optimized for VP9 / AV1

Low-latency, low-bandwidth friendly

😊 Emoji & Emotion System

Real-time emoji reactions during calls

Emotion data streamed from client

Mood aggregation per day

Stored as Mood Calendar

📦 Uploads & Events

Image & media uploads

Couple events (anniversary, birthday)

Event places and product management

🧠 Architecture Overview
React Native App
      ↓
Socket.IO (WebSocket)
      ↓
Node.js Server
      ↓
MongoDB


Video & Audio → Peer-to-Peer (WebRTC)

Signaling & Emotions → Socket.IO

Data Storage → MongoDB

📁 Folder Structure
backend/
│
├── server.js                 # Main server entry
├── .env                      # Environment variables
│
├── conectdb/
│   └── db.js                 # MongoDB connection
│
├── router/
│   ├── userRouter.js         # User APIs
│   ├── chat.js               # Chat REST APIs
│   ├── chatSocket.js         # Socket.IO logic (chat + video call)
│   ├── milestoneRouter.js    # Couple milestones
│   ├── uplodRouter.js        # File upload handler
│   ├── productRoutes.js
│   ├── eventplaceRoutes.js
│   └── event.js
│
├── module/
│   ├── ChatMessage.js        # Chat schema
│   ├── User.js
│   ├── Milestone.js
│   └── Event.js
│
├── uploads/                  # Uploaded files
└── package.json

🔌 Socket.IO Events
🧑 User Connection
register_user
join_chat

💬 Chat
send_message
receive_message

📞 Video Call Signaling
call_user
accept_call
webrtc_offer
webrtc_answer
ice_candidate
end_call

😊 Emotion & Emoji
send_emoji
emotion_update
daily_mood_result

🛠️ Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	MongoDB, Mongoose
Real-time	Socket.IO
Video Call	WebRTC (VP9 / AV1)
Uploads	Multer
Frontend	React Native, Next.js
Auth	JWT (optional)
AI Emotion	Client-side ML (TensorFlow.js / MediaPipe)
⚙️ Environment Variables

Create a .env file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/soullink

▶️ Run the Server
npm install
npm start


Server runs on:

http://localhost:5000


📱 For React Native, use:

http://YOUR_PC_IP:5000

📡 Why Backend is Lightweight

❌ No video streaming server

❌ No media storage

✅ Only signaling & metadata

✅ Extremely low internet usage

✅ Scales easily

🧪 Tested With

Android Emulator

Physical Android device

React Native CLI

Socket.IO Client

WebRTC peer connections

🌱 Future Enhancements

AI emotion accuracy improvements

Mood analytics dashboard

Call recording (optional)

End-to-end encryption

Push notifications

❤️ Project Vision

Soul Link aims to strengthen emotional bonding by combining:

Real-time communication

Emotion awareness

Relationship memories

Privacy-first design

👨‍💻 Author

Nilothpol Koner
Computer Science Student | Full-Stack Developer