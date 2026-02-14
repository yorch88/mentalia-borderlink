
const API_URL = import.meta.env.VITE_API_URL;

console.log("ENV:", import.meta.env);
console.log("API_URL:", API_URL);
/* =========================
   API
========================= */

export async function getLanding() {
  const response = await fetch(`${API_URL}/v1/landing/`);

  console.log("STATUS:", response.status);

  const text = await response.text();
  console.log("RAW RESPONSE:", text);

  if (!response.ok) {
    throw new Error("Error cargando landing");
  }

  return JSON.parse(text);
}
export async function sendContact(payload) {
  const response = await fetch(
    `${API_URL}/v1/landing/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
        "Ocurrió un error al enviar tu mensaje."
    );
  }

  return data;
}
