import type { User } from "../../types/userTypes";

const USERS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/users`;

export const getUser = async (id: string): Promise<User | null> => {
	const response = await fetch(`${USERS_URL}/${encodeURIComponent(id)}`, {
		credentials: "include",
	});

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Unable to get user (${response.status})`);
	}

	const data: User = await response.json();

	return data;
};
