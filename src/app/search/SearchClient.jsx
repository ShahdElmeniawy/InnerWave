"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function formatTrack(track) {
  return {
    trackId: track.id,
    title: track.title,
    artist: track.artist?.name || "",
    album: track.album?.title || "",
    cover: track.album?.cover_medium || track.album?.cover || "",
    duration: track.duration || 0,
  };
}

function SongCard({ track }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  async function addToList(e) {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    setError("");

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formatTrack(track)),
      });

      if (res.status === 401) {
        router.push(
          `/signin?redirect=${encodeURIComponent(
            `/search?q=${track.artist?.name || track.title}`,
          )}`,
        );
        return;
      }

      if (!res.ok) throw new Error("Failed to add song");

      setAdded(true);
    } catch {
      setError("Could not add");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="song-card" style={{ position: "relative" }}>
      <Link
        href={`/${track.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="song-card-img">
          <img src={track.album?.cover_medium} alt={track.title} />
          <div className="song-card-play">
            <div className="play-btn-circle">▶</div>
          </div>
        </div>
        <h4>{track.title}</h4>
        <p>{track.artist?.name}</p>
      </Link>
      <button
        type="button"
        onClick={addToList}
        disabled={adding || added}
        aria-label={added ? "Added to playlist" : "Add to playlist"}
        title={added ? "Added to playlist" : "Add to playlist"}
        style={{
          marginTop: 10,
          width: "100%",
          border: "1px solid var(--border)",
          borderRadius: 8,
          background: added ? "var(--accent)" : "transparent",
          color: added ? "#000" : "var(--text)",
          padding: "9px 10px",
          cursor: adding || added ? "default" : "pointer",
          fontWeight: 700,
        }}
      >
        {adding ? "Adding..." : added ? "Added" : "Add to List"}
      </button>
      {error ? (
        <p style={{ color: "#ff8c8c", fontSize: "0.75rem", marginTop: 6 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ViewAllCircle() {
  return (
    <div className="view-all-box">
      <div className="view-all-circle">+</div>
    </div>
  );
}

export default function SearchClient({ query }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(Boolean(query));

  useEffect(() => {
    if (!query) {
      setSongs([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    async function getSongs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!ignore) setSongs(data.data || []);
      } catch {
        if (!ignore) setSongs([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    getSongs();

    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <div className="page-wrapper" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 30, fontWeight: 800 }}>
        Results for <span style={{ color: "var(--accent)" }}>{query}</span>
      </h1>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" /> Searching...
        </div>
      ) : songs.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          {query ? "No songs found" : "Search for a song, artist or album"}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 24,
          }}
        >
          {songs.map((song) => (
            <SongCard key={song.id} track={song} />
          ))}
          <ViewAllCircle />
        </div>
      )}
    </div>
  );
}
