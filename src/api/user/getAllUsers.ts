import type { User } from "../../types/userTypes";

const USERS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/users`;

export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch(USERS_URL, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Unable to get users (${response.status})`);
  }

  const data: User[] = await response.json();
  return data;
};