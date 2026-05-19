"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={styles.page}>Loading sign in...</div>}>
      <SignInClient />
    </Suspense>
  );
}

function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) return setErrors(data.errors);
        setServerError(data.message || "Login failed");
        return;
      }

      setUser(data.user);
      router.push(redirect);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <Link href="/" style={styles.logo}>
          Innerwave
        </Link>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        {serverError && <div style={styles.serverError}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              autoComplete="email"
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
              autoComplete="current-password"
            />
            {errors.password && (
              <span style={styles.error}>{errors.password}</span>
            )}
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: "24px",
  },
  card: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
  },
  logo: {
    display: "block",
    fontFamily: "var(--font-display)",
    fontSize: "1.4rem",
    fontWeight: 800,
    background:
      "linear-gradient(135deg, #e91e8c 0%, #ff4db8 50%, #c2185b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "24px",
    textDecoration: "none",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "var(--text)",
    marginBottom: "8px",
  },
  subtitle: {
    color: "var(--muted)",
    fontSize: "0.9rem",
    marginBottom: "28px",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "var(--text)",
    fontSize: "0.85rem",
    fontWeight: 500,
    marginBottom: "8px",
    fontFamily: "var(--font-body)",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputError: {
    borderColor: "#e53e3e",
  },
  error: {
    display: "block",
    color: "#fc8181",
    fontSize: "0.78rem",
    marginTop: "6px",
  },
  serverError: {
    background: "rgba(229,62,62,0.1)",
    border: "1px solid rgba(229,62,62,0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fc8181",
    fontSize: "0.85rem",
    marginBottom: "20px",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.2s",
  },
  footer: {
    textAlign: "center",
    color: "var(--muted)",
    fontSize: "0.85rem",
    marginTop: "24px",
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
};
