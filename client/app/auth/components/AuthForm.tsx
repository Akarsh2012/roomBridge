"use client";

import { useState } from "react";
import { login as loginApi, register as registerApi } from "@/services/auth";

type Mode = "login" | "register";

export default function AuthForm({ mode = "login" }: { mode?: Mode }) {
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    setError(null);
    setSuccess(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!isLogin && confirm !== password) {
      return "Passwords do not match";
    }
    if (!isLogin && name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginApi({ email, password });
        setSuccess(`Welcome ${res.user.name}!`);
      } else {
        const res = await registerApi({ name, email, password });
        setSuccess(`Account created for ${res.name}`);
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{isLogin ? "Login" : "Create account"}</h1>
      <p className="text-sm text-gray-600">
        {isLogin ? "Sign in to continue" : "Register to get started"}
      </p>

      {!isLogin && (
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="Jane Doe"
          />
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border p-2 focus:outline-none focus:ring"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border p-2 focus:outline-none focus:ring"
          placeholder="••••••••"
        />
      </div>

      {!isLogin && (
        <div className="space-y-1">
          <label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border p-2 focus:outline-none focus:ring"
            placeholder="••••••••"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign in" : "Create account"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Demo login: demo@roombridge.app / password
      </p>
    </form>
  );
}

