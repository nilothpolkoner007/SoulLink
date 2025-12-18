import express from 'express';
import multer from 'multer';
import ChatBundle from '../module/ChatMessage.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

/* ================= CLOUDINARY ================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

/* ================= FILE UPLOAD ================= */

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'chat_uploads', resource_type: 'auto' },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Upload failed' });
      }
      res.json({ url: result.secure_url });
    },
  );

  stream.end(req.file.buffer);
});

/* ================= GET CHAT HISTORY ================= */

router.get('/:roomId', async (req, res) => {
  try {
    const bundles = await ChatBundle.find({ roomId: req.params.roomId });

    const messages = bundles.flatMap((b) =>
      b.messages.map((m) => ({
        content: m.content,
        created_at: m.created_at,
        sender_id: b.sender_id,
      })),
    );

    res.json(messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

/* ================= DELETE MESSAGE ================= */

router.delete('/message', async (req, res) => {
  const { roomId, sender_id, created_at } = req.body;

  await ChatBundle.updateOne({ roomId, sender_id }, { $pull: { messages: { created_at } } });

  res.json({ success: true });
});

export default router;
