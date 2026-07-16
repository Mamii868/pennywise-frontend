import { useEffect, useState, type FormEvent } from "react";
import { createUser } from "../api/user/createUser";
import { loginUser } from "../api/user/loginUser";
import type { User } from "../types/userTypes";
import Button from "./Button";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  onAuthenticated: (user: User) => void;
};

const AuthModal = ({
  isOpen,
  initialMode,
  onClose,
  onAuthenticated,
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMode(initialMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  const isSigningUp = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isSigningUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = { username: username.trim(), password };
      let user: User | null;

      if (isSigningUp) {
        await createUser(credentials);
        user = await loginUser(credentials);
      } else {
        user = await loginUser(credentials);
      }

      if (!user) {
        setError("Invalid username or password.");
        return;
      }

      onAuthenticated(user);
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-labelledby="auth-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
    >
      <section className="w-full max-w-md rounded-3xl border border-clown-red/40 bg-dark-lightbg p-6 shadow-2xl shadow-black/50 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-clown-red uppercase">
              Penny Wise
            </p>
            <h2 className="mt-1 text-2xl font-bold" id="auth-modal-title">
              {isSigningUp ? "Create your account" : "Welcome back"}
            </h2>
          </div>
          <button
            aria-label="Close authentication window"
            className="rounded-full px-3 py-1 text-2xl text-dark-subtext transition hover:bg-dark-bg hover:text-dark-text"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-dark-bg p-1">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
              !isSigningUp ? "bg-clown-red text-dark-text" : "text-dark-subtext"
            }`}
            disabled={isSubmitting}
            onClick={() => {
              setMode("login");
              setError("");
            }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
              isSigningUp ? "bg-clown-red text-dark-text" : "text-dark-subtext"
            }`}
            disabled={isSubmitting}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold" htmlFor="auth-username">
            Username
            <input
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-dark-subtext/30 bg-dark-bg px-4 py-3 text-dark-text outline-none transition focus:border-clown-red"
              disabled={isSubmitting}
              id="auth-username"
              minLength={1}
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>

          <label className="block text-sm font-semibold" htmlFor="auth-password">
            Password
            <input
              autoComplete={isSigningUp ? "new-password" : "current-password"}
              className="mt-2 w-full rounded-xl border border-dark-subtext/30 bg-dark-bg px-4 py-3 text-dark-text outline-none transition focus:border-clown-red"
              disabled={isSubmitting}
              id="auth-password"
              minLength={1}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {isSigningUp && (
            <label className="block text-sm font-semibold" htmlFor="auth-confirm-password">
              Confirm password
              <input
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-dark-subtext/30 bg-dark-bg px-4 py-3 text-dark-text outline-none transition focus:border-clown-red"
                disabled={isSubmitting}
                id="auth-confirm-password"
                minLength={1}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
            </label>
          )}

          {error && (
            <p className="rounded-xl border border-clown-red/60 bg-blood-red/20 px-3 py-2 text-sm text-dark-text" role="alert">
              {error}
            </p>
          )}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Please wait…"
              : isSigningUp
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default AuthModal;