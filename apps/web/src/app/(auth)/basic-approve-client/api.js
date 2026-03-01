const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   Obtener preview antes de activar
========================= */
export async function approvePreview(token) {
  const response = await fetch(
    `${API_URL}/v1/onboarding/approve-preview?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Token inválido o expirado"
    );
  }

  return data;
}

/* =========================
   Activar definitivamente
========================= */
export async function approveTenant(token) {
  const response = await fetch(
    `${API_URL}/v1/onboarding/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
      data?.detail ||
      "Error en activación"
    );
  }

  return data;
}