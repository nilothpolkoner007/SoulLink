// services/partner.ts
const API_URL = 'http://192.168.31.91:5000'; // Backend URL

export async function createPendingConnection(userId: string) {
  const res = await fetch(`${API_URL}/user/generate-partner-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userId}` }, // Assuming userId is token or adjust
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error('Failed to generate code');

  const data = await res.json();
  return data.code; // backend returns { code: "ABCDEFGH" }
}

export async function redeemCodeAndConnect(code: string, receiverId: string) {
  const res = await fetch(`${API_URL}/user/connect-partner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receiverId}` },
    body: JSON.stringify({ partnerCode: code }),
  });

  if (!res.ok) throw new Error('Connection failed');

  return await res.json();
}
export default { createPendingConnection, redeemCodeAndConnect };
