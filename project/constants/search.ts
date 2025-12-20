// services/search.ts
const API_URL = 'http://192.168.31.91:5000'; // change this

export async function searchUsersByPrefix(prefix: string) {
  const res = await fetch(`${API_URL}/search?prefix=${prefix}`);

  if (!res.ok) return { items: [] };

  return await res.json();
}
