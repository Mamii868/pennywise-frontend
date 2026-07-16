export type Transaction = {
  id: number;
  description: string;
  vendor: string;
  amount: number | string;
  userId: string;
  createdAt: string;
  reference: string;
};

export type TransactionPayload = {
  description: string;
  vendor: string;
  amount: number;
};