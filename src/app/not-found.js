import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: "16px",
      textAlign: "center",
    }}>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "5rem",
        fontWeight: 800,
        color: "var(--accent)",
        lineHeight: 1,
      }}>404</h1>
      <p style={{ color: "var(--muted)", fontSize: "1rem" }}>This page doesn't exist in the wave.</p>
      <Link href="/" style={{
        padding: "10px 28px",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: "100px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "0.9rem",
      }}>Go Home</Link>
    </div>
  );
}