import { useState, type FormEvent } from "react";
import { createUser } from "../api/user/createUser";
import { loginUser } from "../api/user/loginUser";
import type { User } from "../types/userTypes";
import Button from "./Button";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  initialMode: AuthMode;
  onClose: () => void;
  onAuthenticated: (user: User) => void;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
};

const AuthModal = ({
  initialMode,
  onClose,
  onAuthenticated,
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
  };

  const isSigningUp = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    setIsSubmitting(true);

    try {
      const credentials = {
        username: form.username.trim(),
        password: form.password,
      };
      if (isSigningUp) {
        await createUser({
          ...credentials,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
        });
      }

      const user = await loginUser(credentials);

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
      <section className="border-clown-red/40 bg-dark-lightbg w-full max-w-md rounded-3xl border p-6 shadow-2xl shadow-black/50 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-clown-red text-sm font-semibold tracking-[0.2em] uppercase">
              Penny Wise
            </p>
            <h2 className="mt-1 text-2xl font-bold" id="auth-modal-title">
              {isSigningUp ? "Create your account" : "Welcome back"}
            </h2>
          </div>
          <button
            aria-label="Close authentication window"
            className="text-dark-subtext hover:bg-dark-bg hover:text-dark-text rounded-full px-3 py-1 text-2xl transition cursor-pointer"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>

        <div className="bg-dark-bg mb-6 grid grid-cols-2 rounded-xl p-1">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-bold transition cursor-pointer ${
              !isSigningUp ? "bg-clown-red text-dark-text" : "text-dark-subtext"
            }`}
            disabled={isSubmitting}
            onClick={() => selectMode("login")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-bold transition cursor-pointer ${
              isSigningUp ? "bg-clown-red text-dark-text" : "text-dark-subtext"
            }`}
            disabled={isSubmitting}
            onClick={() => selectMode("signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSigningUp && (
            <>
              <label
                className="block text-sm font-semibold"
                htmlFor="auth-first-name"
              >
                First name
                <input
                  autoComplete="given-name"
                  className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
                  disabled={isSubmitting}
                  id="auth-first-name"
                  maxLength={45}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  pattern="[^<>]*"
                  required
                  value={form.firstName}
                />
              </label>

              <label
                className="block text-sm font-semibold"
                htmlFor="auth-last-name"
              >
                Last name
                <input
                  autoComplete="family-name"
                  className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
                  disabled={isSubmitting}
                  id="auth-last-name"
                  maxLength={45}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  pattern="[^<>]*"
                  required
                  value={form.lastName}
                />
              </label>

              <label className="block text-sm font-semibold" htmlFor="auth-email">
                Email
                <input
                  autoComplete="email"
                  className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
                  disabled={isSubmitting}
                  id="auth-email"
                  maxLength={100}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
            </>
          )}

          <label
            className="block text-sm font-semibold"
            htmlFor="auth-username"
          >
            Username
            <input
              autoComplete="username"
              className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
              disabled={isSubmitting}
              id="auth-username"
              maxLength={30}
              minLength={2}
              onChange={(event) => updateField("username", event.target.value)}
              pattern="[a-zA-Z0-9._-]+"
              required
              value={form.username}
            />
          </label>

          <label
            className="block text-sm font-semibold"
            htmlFor="auth-password"
          >
            Password
            <input
              autoComplete={isSigningUp ? "new-password" : "current-password"}
              className="border-dark-subtext/30 bg-dark-bg text-dark-text focus:border-clown-red mt-2 w-full rounded-xl border px-4 py-3 transition outline-none"
              disabled={isSubmitting}
              id="auth-password"
              maxLength={100}
              minLength={8}
              onChange={(event) => updateField("password", event.target.value)}
              required
              type="password"
              value={form.password}
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
