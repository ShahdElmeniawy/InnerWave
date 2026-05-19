"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm)
      errs.confirm = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) return setErrors(data.errors);
        setServerError(data.message || "Registration failed");
        return;
      }

      setUser(data.user);
      router.push("/");
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
        <Link href="/" style={styles.logo}>Innerwave</Link>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Join Innerwave for free</p>

        {serverError && <div style={styles.serverError}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              autoComplete="name"
            />
            {errors.name && <span style={styles.error}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
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
              placeholder="Min. 6 characters"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              autoComplete="new-password"
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat password"
              style={{ ...styles.input, ...(errors.confirm ? styles.inputError : {}) }}
              autoComplete="new-password"
            />
            {errors.confirm && <span style={styles.error}>{errors.confirm}</span>}
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/signin" style={styles.link}>Sign in</Link>
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
    background: "linear-gradient(135deg, #e91e8c 0%, #ff4db8 50%, #c2185b 100%)",
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
  field: { marginBottom: "20px" },
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
  inputError: { borderColor: "#e53e3e" },
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