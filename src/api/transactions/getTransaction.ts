import type { Transaction } from "../../types/transactionTypes";

const TRANSACTIONS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/transactions`;

export const getTransaction = async (id: number): Promise<Transaction | null> => {
  const response = await fetch(`${TRANSACTIONS_URL}/${id}`, {
    credentials: "include",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to get transaction (${response.status})`);
  }

  const data: Transaction = await response.json();

  return data;
};