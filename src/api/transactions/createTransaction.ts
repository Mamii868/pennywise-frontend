import type {
  Transaction,
  TransactionPayload,
} from "../../types/transactionTypes";

const TRANSACTIONS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/transactions`;

export const createTransaction = async (
  transaction: TransactionPayload,
): Promise<Transaction | null> => {
  const response = await fetch(TRANSACTIONS_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to create transaction (${response.status})`);
  }

  const data: Transaction = await response.json();

  return data;
};