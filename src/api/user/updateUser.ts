import type { UpdateUserPayload, User } from "../../types/userTypes";

const USERS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/users`;

export const updateUser = async (
  id: string,
  user: UpdateUserPayload,
): Promise<User | null> => {
  const response = await fetch(`${USERS_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to update user (${response.status})`);
  }

  const data: User = await response.json();

  return data;
};