const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {

  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

}

/* =========================
   GET BRANCHES
========================= */

export async function getBranches() {

  const response = await fetch(
    `${API_URL}/v1/branches/`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Error cargando sucursales");
  }

  return data;

}

/* =========================
   CREATE BRANCH
========================= */

export async function createBranch(payload) {

  const response = await fetch(
    `${API_URL}/v1/branches/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Error creando sucursal");
  }

  return data;

}