// utils/generateId.js
import sha256 from 'crypto-js/sha256';

/**
 * Generate a unique Couple ID
 * Combines current user ID and partner ID, hashes it
 * @param {string} userId1 - current user
 * @param {string} userId2 - partner user
 * @returns {string} coupleId
 */
export function generateId(userId1, userId2) {
  if (!userId1 || !userId2) {
    throw new Error('Both user IDs are required to generate couple ID');
  }

  // Sort IDs to ensure deterministic output
  const [idA, idB] = [userId1, userId2].sort();

  // Combine and hash
  const combined = idA + '_' + idB;
  const hash = sha256(combined).toString().substring(0, 12); // 12 char hash

  return hash;
}
// After partner code is validated
const partnerDocId = partnerDocId.id; // from Firestore query
const coupleId = generateId(user.uid, partnerDocId);

// Update both users
await db.collection('users').doc(user.uid).update({
  partnerId: partnerDocId,
  status: 'connected',
  coupleId,
});

await db.collection('users').doc(partnerDocId).update({
  partnerId: user.uid,
  status: 'connected',
  coupleId,
});

// Now coupleId can be used for chat, memory, gifts
console.log('Couple ID:', coupleId);