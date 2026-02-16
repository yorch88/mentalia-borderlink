const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   API
========================= */

export async function loginUser(payload) {
  const response = await fetch(
    `${API_URL}/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
      data?.detail ||
      'Credenciales inválidas'
    );
  }

  return data;
}
