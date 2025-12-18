// services/partner.ts
const API_URL = 'https://your-backend-url.com'; // <-- change this

export async function createPendingConnection(userId: string) {
  const res = await fetch(`${API_URL}/partner/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) throw new Error('Failed to generate code');

  const data = await res.json();
  return data.code; // backend should return { code: "ABCDEFGH" }
}

export async function redeemCodeAndConnect(code: string, receiverId: string) {
  const res = await fetch(`${API_URL}/partner/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, receiverId }),
  });

  if (!res.ok) throw new Error('Connection failed');

  return await res.json();
}
export default {createPendingConnection, redeemCodeAndConnect};