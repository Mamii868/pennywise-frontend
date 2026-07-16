import { useState, type FormEvent } from "react";
import { createTransaction } from "../api/transactions/createTransaction";
import type { Transaction } from "../types/transactionTypes";
import Button from "./Button";

type TransactionMode = "deposit" | "payment";

type TransactionModalProps = {
  mode: TransactionMode;
  onClose: () => void;
  onCreated: (transaction: Transaction) => void;
};

const TransactionModal = ({
  mode,
  onClose,
  onCreated,
}: TransactionModalProps) => {
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDeposit = mode === "deposit";
  const title = isDeposit ? "Add a deposit" : "Add a payment";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const enteredAmount = Number(amount);

    if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      const transaction = await createTransaction({
        description: description.trim(),
        vendor: vendor.trim(),
        amount: isDeposit ? enteredAmount : -enteredAmount,
      });

      if (!transaction) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      onCreated(transaction);
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create transaction.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-labelledby="transaction-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
    >
      <section className="border-clown-red/40 bg-dark-lightbg w-full max-w-md rounded-3xl border p-6 shadow-2xl shadow-black/50 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-clown-red text-sm font-semibold tracking-[0.2em] uppercase">
              Penny Wise
            </p>
            <h2 className="mt-1 text-2xl font-bold" id="transaction-modal-title">
              {title}
            </h2>
          </div>
          <button
            aria-label="Close transaction window"
            className="text-dark-subtext hover:bg-dark-bg hover:text-dark-text rounded-full px-3 py-1 text-2xl transition cursor-pointer"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold" htmlFor="description">
            Description
            <input
              autoComplete="off"
              className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
              disabled={isSubmitting}
              id="description"
              maxLength={45}
              onChange={(event) => setDescription(event.target.value)}
              pattern="[^<>]*"
              required
              value={description}
            />
          </label>

          <label className="block text-sm font-semibold" htmlFor="vendor">
            Vendor
            <input
              autoComplete="organization"
              className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
              disabled={isSubmitting}
              id="vendor"
              maxLength={45}
              onChange={(event) => setVendor(event.target.value)}
              pattern="[^<>]*"
              required
              value={vendor}
            />
          </label>

          <label className="block text-sm font-semibold" htmlFor="amount">
            Amount
            <input
              className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
              disabled={isSubmitting}
              id="amount"
              inputMode="decimal"
              max="99999999.99"
              min="0.01"
              onChange={(event) => setAmount(event.target.value)}
              required
              step="0.01"
              type="number"
              value={amount}
            />
          </label>

          {error && (
            <p
              className="border-clown-red/60 bg-blood-red/20 text-dark-text rounded-xl border px-3 py-2 text-sm"
              role="alert"
            >
              {error}
            </p>
          )}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving…" : title}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default TransactionModal;