const LOGOUT_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/users/logout`;

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(LOGOUT_URL, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Unable to log out (${response.status})`);
  }
};