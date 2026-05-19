import { cookies } from "next/headers";
import Link from "next/link";

async function getPlaylist() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return [];

    const res = await fetch("http://localhost:3000/api/playlist", {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function YourListPage() {
  const tracks = await getPlaylist();
  console.log("Fetched playlist tracks:", tracks);

  return (
    <>
      <div className="discover-hero">
        <h1>Your <span>Playlist</span></h1>
        <p>Your saved songs and personal playlist.</p>
      </div>

      <div className="page-wrapper" style={{ paddingTop: 0 }}>
        {tracks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 32px", color: "var(--muted)" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Your playlist is empty</p>
            <p style={{ fontSize: "0.85rem" }}>Click the ♡ button on any song to add it here</p>
          </div>
        ) : (
          <table className="trending-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <td style={{ color: "var(--muted)", fontSize: "0.75rem" }}>#</td>
                <td style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Song</td>
                <td style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Album</td>
                <td style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Duration</td>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, i) => (
                <tr key={track.trackId || i} className="playlist-row">
                  <td style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                  }}>
                    {i + 1}
                  </td>
                  <td>
                    <Link href={`/${track.trackId}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={track.cover}
                          alt={track.title}
                          style={{ width: 42, height: 42, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ color: "var(--text)", fontWeight: 500, fontSize: "0.85rem" }}>
                            {track.title}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                            {track.artist}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{track.album}</td>
                  <td style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                    {track.duration
                      ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}