const TRANSACTIONS_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/transactions`;

export const deleteTransaction = async (id: number): Promise<boolean> => {
  const response = await fetch(`${TRANSACTIONS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error(`Unable to delete transaction (${response.status})`);
  }

  return true;
};