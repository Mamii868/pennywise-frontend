import type { Transaction } from "../../types/transactionTypes";

const TRANSACTIONS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/transactions`;

export const getTransactionsByUserId = async (
  userId: string,
): Promise<Transaction[] | null> => {
  const response = await fetch(
    `${TRANSACTIONS_URL}/user/${encodeURIComponent(userId)}`,
    {
      credentials: "include",
    },
  );

  if (response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to get the user's transactions (${response.status})`);
  }

  const data: Transaction[] = await response.json();

  return data;
};