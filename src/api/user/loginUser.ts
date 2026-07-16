import type { LoginPayload, User } from "../../types/userTypes";

const LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/users/login`;

export const loginUser = async (credentials: LoginPayload): Promise<User | null> => {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to log in (${response.status})`);
  }

  const data: User = await response.json();

  return data;
};