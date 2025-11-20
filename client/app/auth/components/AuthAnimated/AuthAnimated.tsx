"use client";
import { useState } from "react";
import { login as loginApi, register as registerApi } from "@/services/auth";
import styles from "./AuthAnimated.module.css";

type Mode = "login" | "register";

export default function AuthAnimated({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  function validate() {
    setError(null);
    setSuccess(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!isLogin && name.trim().length < 2) return "Name must be at least 2 characters";
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
    <div className={styles.page}>
      <div className={`${styles.container} ${isLogin ? styles.signIn : styles.signUp}`}>
        {/* Left/Right panels switch based on mode */}
        <div className={`${styles.formPane} ${styles.panelLeft}`}>
          <h2 className={styles.title}>{isLogin ? "Sign In" : "Create Account"}</h2>
          <div className={styles.socialRow}>
            {["G+", "F", "X", "In"].map((label) => (
              <button key={label} className={styles.socialBtn} type="button" aria-label={label}>
                {label}
              </button>
            ))}
          </div>
          <p className={styles.dividerText}>
            {isLogin ? "or use your email password" : "or use your email for registration"}
          </p>
          <form onSubmit={onSubmit} className={styles.formFields}>
            {!isLogin && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className={`${styles.feedback} ${styles.error}`}>{error}</p>}
            {success && <p className={`${styles.feedback} ${styles.success}`}>{success}</p>}

            {isLogin && (
              <div className={styles.forgot}>
                <a href="#">Forgot your password?</a>
              </div>
            )}
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? (isLogin ? "Signing in..." : "Signing up...") : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>

        <div className={`${styles.formPane} ${styles.panelRight}`}>
          <h2 className={styles.title}>Create Account</h2>
          <div className={styles.socialRow}>
            {["G+", "F", "X", "In"].map((label) => (
              <button key={label} className={styles.socialBtn} type="button" aria-label={label}>
                {label}
              </button>
            ))}
          </div>
          <p className={styles.dividerText}>or use your email for registration</p>
          <form onSubmit={onSubmit} className={styles.formFields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email-register">
                Email
              </label>
              <input
                id="email-register"
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password-register">
                Password
              </label>
              <input
                id="password-register"
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={`${styles.feedback} ${styles.error}`}>{error}</p>}
            {success && <p className={`${styles.feedback} ${styles.success}`}>{success}</p>}
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div
          className={`${styles.overlayPane} ${isLogin ? styles.overlayRight : styles.overlayLeft} ${styles.fadeIn}`}
        >
          <h2>{isLogin ? "Hello, Friend!" : "Welcome Back!"}</h2>
          <p>
            {isLogin
              ? "Register with your personal details to use all of the features."
              : "Enter your personal details to use all of site features."}
          </p>
          <button
            className={styles.secondaryBtn}
            type="button"
            onClick={() => setMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
