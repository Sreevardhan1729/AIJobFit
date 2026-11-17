import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md border border-rule bg-sheet p-8">
        <h1 className="mb-6 font-serif text-3xl font-medium text-ink">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-[3px] border border-rule bg-sheet p-3 text-sm text-ink placeholder:text-ink-2/80 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
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
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-[3px] border border-rule bg-sheet p-3 text-sm text-ink placeholder:text-ink-2/80 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>
          {error && <p className="text-sm text-miss-text">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[3px] bg-ink py-3 text-sm font-semibold text-paper hover:bg-ink-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ink-2">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
