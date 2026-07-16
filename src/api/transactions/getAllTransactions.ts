import type { Transaction } from "../../types/transactionTypes";

const ALL_TRANSACTIONS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/transactions/all`;

export const getAllTransactions = async (): Promise<Transaction[] | null> => {
  const response = await fetch(ALL_TRANSACTIONS_URL, {
    credentials: "include",
  });

  if (response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to get all transactions (${response.status})`);
  }

  const data: Transaction[] = await response.json();

  return data;
};