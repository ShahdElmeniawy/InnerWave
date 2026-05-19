import Link from "next/link";

async function getSongs(query) {
  if (!query) return [];
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function SongCard({ track }) {
  return (
    <Link
      href={`/${track.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="song-card">
        <div className="song-card-img">
          <img src={track.album?.cover_medium} alt={track.title} />
          <div className="song-card-play">
            <div className="play-btn-circle">▶</div>
          </div>
        </div>
        <h4>{track.title}</h4>
        <p>{track.artist?.name}</p>
      </div>
    </Link>
  );
}

function ViewAllCircle() {
  return (
    <div className="view-all-box">
      <div className="view-all-circle">+</div>
    </div>
  );
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";
  const songs = await getSongs(q);

  return (
    <div className="page-wrapper" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: 30, fontWeight: 800 }}>
        Results for <span style={{ color: "var(--accent)" }}>{q}</span>
      </h1>

      {songs.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          {q ? "No songs found" : "Search for a song, artist or album"}
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
          {/* {songs.map((song, i) => (
            // ✅ Link to /{song.id} — same as home and discover pages
            <Link
              key={song.id.trackId || i || song.id}
              href={`/${song.id.trackId}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              {/* <Link href={`/${track.trackId}`} style={{ textDecoration: "none", color: "inherit" }}> */}

          {/* <div className="song-card" style={{ minWidth: "unset" }}>
                <div
                  className="song-card-img"
                  style={{ width: "100%", height: "180px" }}
                >
                  <img
                    src={song.album?.cover_medium}
                    alt={song.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div className="song-card-play">
                    <div className="play-btn-circle">▶</div>
                  </div>
                </div>
                <h4
                  style={{
                    color: "#fff",
                    fontSize: "0.9rem",
                    marginTop: 10,
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {song.title}
                </h4>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                  {song.artist?.name}
                </p>
              </div>
            </Link> */}
          {/* ))} */}
        </div>
      )}
    </div>
  );
}
