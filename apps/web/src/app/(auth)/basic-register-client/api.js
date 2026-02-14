const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   API
========================= */

export async function registerTenant(payload) {
  const response = await fetch(
    `${API_URL}/v1/onboarding/register`,
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
      data?.detail?.[0]?.msg || 'Error en registro'
    );
  }

  return data;
}
