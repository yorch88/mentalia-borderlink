const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   API
========================= */

export async function approveTenant(apiKey) {
  const response = await fetch(
    `${API_URL}/v1/onboarding/approve`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiKey,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
      data?.detail ||
      'Error en activación'
    );
  }

  return data;
}
