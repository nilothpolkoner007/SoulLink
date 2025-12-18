import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: String,
  created_at: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema(
  {
    roomId: { type: String, index: true },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    messages: [MessageSchema],
  },
  { timestamps: true },
);

export default mongoose.model('ChatBundle', ChatSchema);
