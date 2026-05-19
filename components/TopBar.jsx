"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TopBar() {
  const { user, loading, logout } = useAuth();

  const router = useRouter();

  const [query, setQuery] = useState("");

  function handleChange(e) {
    const value = e.target.value;

    setQuery(value);

    // redirect instantly while typing
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  }

  return (
    <div className="topbar">
      {/* SEARCH */}
      <div
        className="search-bar"
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <input
          type="text"
          placeholder="Search For Music, Artists..."
          value={query}
          onChange={handleChange}
        />
      </div>

      {/* NAV */}
      <nav className="topbar-nav">
        <a href="#">About Us</a>
        <a href="#">Contact</a>
        <a href="#">Premium</a>

        {loading ? null : user ? (
          <>
            <span
              style={{
                color: "var(--text)",
                fontSize: "0.85rem",
                fontFamily: "var(--font-body)",
              }}
            >
              {user.name}
            </span>

            <button
              onClick={logout}
              className="btn-login"
              style={{ cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signin">
              <button className="btn-login">
                Login
              </button>
            </Link>

            <Link href="/signup">
              <button className="btn-signup">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}