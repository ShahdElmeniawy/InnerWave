"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SongPage() {
  const { songId } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const trackArtistRef = useRef("");

  async function toggleLike() {
    try {
      if (!liked) {
        const res = await fetch("/api/playlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            trackId: track.id,
            title: track.title,
            artist: track.artist?.name,
            album: track.album?.title,
            cover: track.album?.cover_medium,
            duration: track.duration,
          }),
        });

        if (!res.ok) throw new Error("Failed");

        setLiked(true);
      } else {
        const res = await fetch(`/api/playlist?trackId=${track.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed");

        setLiked(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!songId) return;
    setLoading(true);
    setError(null);

    async function loadTrack() {
      try {
        const [trackRes, playlistRes] = await Promise.all([
          fetch(`/api/track/${encodeURIComponent(songId)}`),
          fetch("/api/playlist", { credentials: "include" }),
        ]);

        const trackData = await trackRes.json();
        let playlist = [];

        if (playlistRes.ok) {
          const playlistJson = await playlistRes.json();
          playlist = playlistJson.data || [];
        }

        if (trackData.error) {
          setError(trackData.error.message || "Track not found");
          return;
        }

        setData({
          track: trackData,
          artistTracks: [],
          related: [],
        });

        const currentTrackId = Number(trackData.id);
        const isLiked = playlist.some(
          (item) => Number(item.trackId) === currentTrackId,
        );
        setLiked(isLiked);
      } catch (err) {
        console.error(err);
        setError("Failed to load song");
      } finally {
        setLoading(false);
      }
    }

    loadTrack();
  }, [songId]);

  function fmt(s) {
    const sec = Math.floor(s);
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: "70vh" }}>
        <div className="spinner" /> Loading track...
      </div>
    );
  }

  if (error || !data?.track) {
    return (
      <div style={{ textAlign: "center", padding: "80px 32px" }}>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          Track not found.
        </p>
        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 24px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "100px",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const { track, artistTracks, related } = data;

  return (
    <>
      {/* HERO BANNER */}
      <div
        style={{
          position: "relative",
          minHeight: 320,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          marginBottom: 0,
        }}
      >
        {/* blurred album art background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${track.album?.cover_xl || track.album?.cover_big})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.3)",
            transform: "scale(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 30%, var(--bg) 100%)",
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "flex-end",
            gap: 32,
            padding: "48px 40px 40px",
            width: "100%",
          }}
        >
          {/* Album Art */}
          <img
            src={track.album?.cover_big || track.album?.cover_medium}
            alt={track.title}
            style={{
              width: 200,
              height: 200,
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              flexShrink: 0,
              objectFit: "cover",
            }}
          />

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                color: "var(--accent)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: 8,
              }}
            >
              Track
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.4rem",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 10,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {track.title}
            </h1>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.9rem",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 500 }}>
                {track.artist?.name}
              </span>
              {track.album?.title && <> &nbsp;·&nbsp; {track.album.title}</>}
              {track.release_date && (
                <> &nbsp;·&nbsp; {track.release_date?.slice(0, 4)}</>
              )}
            </p>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
              {track.rank ? `${(track.rank / 1000000).toFixed(1)}M plays` : ""}
              {track.bpm ? ` · ${Math.round(track.bpm)} BPM` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="page-wrapper" style={{ paddingTop: 32 }}>
        {/* INTEGRATED FULL STREAM DEEZER PLAYER */}
        <div
          style={{
            background: "var(--bg3)",
            borderRadius: 20,
            padding: "24px",
            marginBottom: 48,
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <button
              onClick={() => toggleLike()}
              style={{
                background: "none",
                border: "none",
                color: liked ? "var(--accent)" : "var(--muted)",
                fontSize: "1.5rem",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              {liked ? "♥" : "♡"}
            </button>

            <button
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                borderRadius: "100px",
                padding: "7px 16px",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Share
            </button>
          </div>

          {/* Embedded Full Iframe Player Widget */}
          <iframe
            title="Deezer Player"
            src={`https://widget.deezer.com/widget/dark/track/${songId}?tracklist=false`}
            width="100%"
            height="150"
            allowtransparency="true"
            allow="encrypted-media; clipboard-write"
            style={{ borderRadius: 12, border: "none" }}
          />
        </div>

        {/* TRACK INFO GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginBottom: 48,
          }}
        >
          {/* Details */}
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--border)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              Track Info
            </h3>
            {[
              ["Title", track.title_short || track.title],
              ["Artist", track.artist?.name],
              ["Album", track.album?.title],
              ["Duration", track.duration ? fmt(track.duration) : "—"],
              ["BPM", track.bpm ? Math.round(track.bpm) : "—"],
              ["Release", track.release_date || "—"],
              ["Rank", track.rank ? `#${track.rank.toLocaleString()}` : "—"],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  padding: "10px 0",
                  fontSize: "0.83rem",
                }}
              >
                <span style={{ color: "var(--muted)" }}>{label}</span>
                <span
                  style={{
                    fontWeight: 500,
                    textAlign: "right",
                    maxWidth: "60%",
                    wordBreak: "break-word",
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Artist Top Tracks */}
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--border)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              More by{" "}
              <span style={{ color: "var(--accent)" }}>
                {track.artist?.name}
              </span>
            </h3>
            {artistTracks.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.83rem" }}>
                No tracks found.
              </p>
            ) : (
              artistTracks.map((t, i) => (
                <Link
                  key={t.id}
                  href={`/${t.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.7")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <span
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        width: 20,
                        fontSize: "0.85rem",
                      }}
                    >
                      {i + 1}
                    </span>
                    <img
                      src={t.album?.cover_small}
                      alt={t.title}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.83rem",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#fff",
                        }}
                      >
                        {t.title}
                      </div>
                      <div
                        style={{ fontSize: "0.73rem", color: "var(--muted)" }}
                      >
                        {t.duration ? fmt(t.duration) : ""}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                        flexShrink: 0,
                      }}
                    >
                      ▶
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* RELATED SONGS */}
        {related.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">
                Related <span>Songs</span>
              </h2>
            </div>
            <div className="cards-row">
              {related.map((t) => (
                <Link
                  key={t.id}
                  href={`/${t.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="song-card">
                    <div className="song-card-img">
                      <img src={t.album?.cover_medium} alt={t.title} />
                      <div className="song-card-play">
                        <div className="play-btn-circle">▶</div>
                      </div>
                    </div>
                    <h4>{t.title}</h4>
                    <p>{t.artist?.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
