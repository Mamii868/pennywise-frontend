export type Transaction = {
  id: number;
  userId: string;
  [key: string]: unknown;
};

export type TransactionPayload = {
  [key: string]: unknown;
};