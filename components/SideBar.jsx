"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Discover", href: "/discover", icon: "◎" },
  { label: "Albums", href: "/albums", icon: "⊟" },
  { label: "Artists", href: "/artists", icon: "♪" },
];

const playlistItems = [
  { label: "Your Playlist", href: "/yourlist", icon: "≡" },
  { label: "Add Playlist", href: "#", icon: "＋", accent: true },
];

export default function SideBar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        padding: "0 0 24px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "8px",
        }}
      >
        <h1 className="logo-gradient">Innerwave</h1>
      </div>

      <NavSection label="Menu">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </NavSection>

      <NavSection label="Playlists & Favorites">
        {playlistItems.map((item) => (
          <NavLink
            key={item.label}
            item={item}
            active={pathname === item.href}
            accent={item.accent}
          />
        ))}
      </NavSection>

      {/* Bottom */}
      <div style={{ marginTop: "10px", padding: "0 12px" }}>
        <NavSection label="General">
          <button
            onClick={logout}
            style={{
              border: "none",
              color: "var(--muted)",
              background: "transparent",
            }}
          >
            <NavLink item={{ label: "Logout", href: "#", icon: "⏻" }} accent />
          </button>
        </NavSection>
      </div>
    </aside>
  );
}

function NavSection({ label, children }) {
  return (
    <div style={{ padding: "8px 0", marginBottom: "4px" }}>
      <p
        style={{
          fontSize: "0.65rem",
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          padding: "4px 20px 8px",
          fontFamily: "var(--font-display)",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function NavLink({ item, active, accent }) {
  return (
    <Link
      href={item.href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 20px",
        borderRadius: "0 100px 100px 0",
        marginRight: "12px",
        fontSize: "0.83rem",
        fontFamily: "var(--font-body)",
        color: active ? "#fff" : accent ? "var(--accent)" : "var(--muted)",
        background: active ? "var(--accent)" : "transparent",
        transition: "all 0.15s",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        if (!active)
          e.currentTarget.style.color = accent
            ? "var(--accent)"
            : "var(--muted)";
      }}
    >
      <span style={{ fontSize: "1rem", width: "16px", textAlign: "center" }}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}
