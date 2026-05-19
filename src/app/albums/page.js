import Link from "next/link";

// SSG

const QUERIES = [
  "adele",
  "drake",
  "eminem",
  "billie eilish",
  "blackpink",
  "ed sheeran",
];
async function fetchAlbums() {
  try {
    const results = await Promise.all(
      QUERIES.map((q) =>
        fetch(`${"http://localhost:3000"}/api/songs?q=${q}&limit=4`, {
          cache: "force-cache",
        }).then((r) => r.json()),
      ),
    );
    const all = results.flatMap((r) => r.data ?? []);
    const seen = new Set();
    const unique = all.filter((t) => {
      if (seen.has(t.album?.id)) return false;
      seen.add(t.album?.id);
      return true;
    });
    return unique;
  } catch (e) {
    console.error("Failed to fetch albums:", e);
    return [];
  }
}

export default async function AlbumsPage() {
  const albums = await fetchAlbums();

  return (
    <>
      <div className="discover-hero">
        <h1>
          Top <span>Albums</span>
        </h1>
        <p>Browse through the most popular albums across all genres.</p>
      </div>

      <div className="page-wrapper" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "24px",
          }}
        >
          {albums.map((track) => (
            <Link
              key={track.id}
              href={`/${track.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="album-card" style={{ minWidth: "unset" }}>
                <div
                  className="album-card-img"
                  style={{ width: "100%", height: "160px" }}
                >
                  <img
                    src={track.album?.cover_medium}
                    alt={track.album?.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h4>{track.album?.title}</h4>
                <p>{track.artist?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
