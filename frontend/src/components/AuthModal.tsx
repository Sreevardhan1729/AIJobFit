import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
      resetForm();
    } catch (err: any) {
      const message = err?.response?.data?.detail || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/40 px-4" onClick={onClose}>
          <div
            className="relative w-full max-w-md border border-rule bg-sheet p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-ink-2 hover:text-ink"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 font-serif text-3xl font-medium text-ink">
              {mode === "login" ? "Log in" : "Create an account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-[3px] border border-rule bg-sheet p-3 text-sm text-ink placeholder:text-ink-2/80 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-[3px] border border-rule bg-sheet p-3 text-sm text-ink placeholder:text-ink-2/80 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  placeholder="Min. 8 characters"
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-[3px] border border-rule bg-sheet p-3 text-sm text-ink placeholder:text-ink-2/80 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="Repeat password"
                  />
                </div>
              )}

              {error && <p className="text-sm text-miss-text">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[3px] bg-ink py-3 text-sm font-semibold text-paper hover:bg-ink-2 disabled:opacity-50"
              >
                {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-ink-2">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={switchMode} className="font-medium text-ink underline underline-offset-4">
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
