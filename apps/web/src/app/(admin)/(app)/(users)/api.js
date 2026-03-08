const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   HELPERS
========================= */

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

/* =========================
   GET USERS
========================= */

export async function getUsers() {
  const response = await fetch(
    `${API_URL}/v1/users/`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Error obteniendo usuarios");
  }

  return data;
}

/* =========================
   CREATE USER
========================= */

export async function createUser(payload) {
  const response = await fetch(
    `${API_URL}/v1/users/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg || data?.detail || "Error creando usuario"
    );
  }

  return data;
}

/* =========================
   GET BRANCHES
========================= */

export async function getBranches() {
    const response = await fetch(`${API_URL}/v1/branches/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data?.detail || "Error obteniendo sucursales");
    }
  
    return data;
  }