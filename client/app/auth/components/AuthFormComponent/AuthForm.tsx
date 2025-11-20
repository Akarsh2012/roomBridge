"use client";
import { useState } from "react";
import { login as loginApi, register as registerApi } from "@/services/auth";
import styles from "./AuthForm.module.css";

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
    <form onSubmit={onSubmit} className={styles.form}>
      <h1 className={styles.title}>{isLogin ? "Login" : "Create account"}</h1>
      <p className={styles.subtitle}>
        {isLogin ? "Sign in to continue" : "Register to get started"}
      </p>

      {!isLogin && (
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Jane Doe"
          />
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder="you@example.com"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          placeholder="••••••••"
        />
      </div>

      {!isLogin && (
        <div className={styles.field}>
          <label htmlFor="confirm" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
          />
        </div>
      )}

      {error && <p className={`${styles.feedback} ${styles.error}`}>{error}</p>}
      {success && <p className={`${styles.feedback} ${styles.success}`}>{success}</p>}

      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign in" : "Create account"}
      </button>

      <p className={styles.hint}>Demo login: demo@roombridge.app / password</p>
    </form>
  );
}
