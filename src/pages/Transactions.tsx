import { useEffect, useMemo, useState } from "react";
import { getMyTransactions } from "../api/transactions/getMyTransactions";
import Button from "../components/Button";
import TransactionModal from "../components/TransactionModal";
import type { Transaction } from "../types/transactionTypes";
import type { User } from "../types/userTypes";

type TransactionFilter = "all" | "deposits" | "payments";
type TransactionAction = "deposit" | "payment" | null;

type TransactionsProps = {
  currentUser: User;
  onLogout: () => void;
};

const formatCurrency = (amount: Transaction["amount"]) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const Transactions = ({ currentUser, onLogout }: TransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<TransactionAction>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getMyTransactions();

        if (!data) {
          setError("Your session has expired. Please sign in again.");
          return;
        }

        setTransactions(data);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load transactions.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadTransactions();
  }, []);

  const recentTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => {
          const amount = Number(transaction.amount);

          return (
            filter === "all" ||
            (filter === "deposits" && amount >= 0) ||
            (filter === "payments" && amount < 0)
          );
        })
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        )
        .slice(0, 10),
    [filter, transactions],
  );

  const openModal = (action: Exclude<TransactionAction, null>) => {
    setActiveModal(action);
    setIsFilterOpen(false);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions,
    ]);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10 sm:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-clown-red text-sm font-semibold tracking-[0.2em] uppercase">
            Penny Wise
          </p>
          <h1 className="mt-1 text-3xl font-bold">Your transactions</h1>
          <p className="text-dark-subtext mt-2">
            Welcome back, {currentUser.firstName || currentUser.username}.
          </p>
        </div>
        <Button onClick={onLogout} variant="outline">
          Sign out
        </Button>
      </header>

      <section aria-labelledby="recent-transactions-title" className="flex-1">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold" id="recent-transactions-title">
              Recent transactions
            </h2>
            <p className="text-dark-subtext mt-1 text-sm">
              Your 10 most recent {filter === "all" ? "transactions" : filter}.
            </p>
          </div>
          <span className="border-dark-subtext/25 bg-dark-lightbg rounded-full border px-3 py-1 text-sm">
            {recentTransactions.length} shown
          </span>
        </div>

        <div className="border-dark-subtext/20 bg-dark-lightbg overflow-hidden rounded-2xl border">
          {isLoading ? (
            <p className="text-dark-subtext px-5 py-10 text-center">
              Loading transactions…
            </p>
          ) : error ? (
            <p className="border-clown-red/40 bg-blood-red/20 m-4 rounded-xl border px-4 py-3 text-sm">
              {error}
            </p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-dark-subtext px-5 py-10 text-center">
              No transactions found.
            </p>
          ) : (
            <ul className="divide-dark-subtext/15 divide-y">
              {recentTransactions.map((transaction) => {
                const amount = Number(transaction.amount);

                return (
                  <li
                    className="flex items-center justify-between gap-4 px-5 py-4"
                    key={transaction.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {transaction.description}
                      </p>
                      <p className="text-dark-subtext mt-1 truncate text-sm">
                        {transaction.vendor} · {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 font-bold ${
                        amount >= 0 ? "text-emerald-400" : "text-clown-red"
                      }`}
                    >
                      {amount >= 0 ? "+" : ""}
                      {formatCurrency(amount)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section
        aria-label="Transaction actions"
        className="border-dark-subtext/20 bg-dark-lightbg mt-8 rounded-2xl border p-4 sm:p-5"
      >
        {isFilterOpen && (
          <div className="mb-4 flex flex-wrap gap-2" role="group">
            {(["all", "deposits", "payments"] as const).map((option) => (
              <button
                aria-pressed={filter === option}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === option
                    ? "bg-clown-red text-dark-text"
                    : "bg-dark-bg text-dark-subtext hover:text-dark-text"
                }`}
                key={option}
                onClick={() => {
                  setFilter(option);
                  setIsFilterOpen(false);
                }}
                type="button"
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <Button onClick={() => openModal("deposit")}>Deposit</Button>
          <Button onClick={() => openModal("payment")} variant="secondary">
            Payment
          </Button>
          <Button
            aria-expanded={isFilterOpen}
            onClick={() => {
              setIsFilterOpen((isOpen) => !isOpen);
              setActiveModal(null);
            }}
            variant="outline"
          >
            Filter transactions
          </Button>
        </div>
      </section>

      {activeModal && (
        <TransactionModal
          mode={activeModal}
          onClose={() => setActiveModal(null)}
          onCreated={addTransaction}
        />
      )}
    </main>
  );
};

export default Transactions;