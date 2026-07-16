import type {
  Transaction,
  TransactionPayload,
} from "../../types/transactionTypes";

const TRANSACTIONS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/transactions`;

export const updateTransaction = async (
  id: number,
  transaction: TransactionPayload,
): Promise<Transaction | null> => {
  const response = await fetch(`${TRANSACTIONS_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unable to update transaction (${response.status})`);
  }

  const data: Transaction = await response.json();

  return data;
};