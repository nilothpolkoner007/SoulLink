import express from 'express';

const router = express.Router();

/* ================= CALL STATUS ================= */
router.post('/status', (req, res) => {
  const { roomId, status } = req.body;

  console.log(`📞 Call ${status} in room ${roomId}`);

  res.json({ success: true });
});

export default router;
