const API_URL = import.meta.env.VITE_API_URL;

export async function logout() {
  const token = localStorage.getItem("access_token");

  if (!token) return false;

  const response = await fetch(`${API_URL}/v1/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return false;

  localStorage.removeItem("access_token");
  return true;
}