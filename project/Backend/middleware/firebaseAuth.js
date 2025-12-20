import admin from '../config/firebase.js';

const firebaseAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No Firebase token' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded; // uid, email, name
    next();
  } catch (err) {
    console.error('❌ Firebase auth error:', err);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

export default firebaseAuth;

