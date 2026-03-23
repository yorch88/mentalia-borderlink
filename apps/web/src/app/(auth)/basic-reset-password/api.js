const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   API
========================= */

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
      data?.detail ||
      fallbackMessage
    );
  }

  return data;
}

export async function requestPasswordReset(payload) {
  const response = await fetch(`${API_URL}/v1/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(
    response,
    "No se pudo enviar el correo de recuperación"
  );
}

export async function verifyResetPin(payload) {
  const response = await fetch(`${API_URL}/v1/auth/verify-reset-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(
    response,
    "No se pudo validar el código"
  );
}

export async function resetPassword(payload) {
  const response = await fetch(`${API_URL}/v1/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(
    response,
    "No se pudo actualizar la contraseña"
  );
}