// services/search.ts
const API_URL = 'https://your-backend-url.com'; // change this

export async function searchUsersByPrefix(prefix: string) {
  const res = await fetch(`${API_URL}/search?prefix=${prefix}`);

  if (!res.ok) return { items: [] };

  return await res.json();
}
