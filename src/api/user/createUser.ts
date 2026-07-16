import type { CreateUserPayload, User } from "../../types/userTypes";

const USERS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/users`;

export const createUser = async (user: CreateUserPayload): Promise<User> => {
  const response = await fetch(USERS_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Unable to create user (${response.status})`);
  }

  const data: User = await response.json();

  return data;
};
