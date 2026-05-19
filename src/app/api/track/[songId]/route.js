import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { songId } = await params;

  if (!songId) {
    return NextResponse.json({ error: "Missing songId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.deezer.com/track/${encodeURIComponent(songId)}`,
    );

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Deezer non-JSON response:", text.slice(0, 100));
      return NextResponse.json(
        { error: "Unable to parse Deezer response" },
        { status: 502 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Deezer track fetch error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch track from Deezer" },
      { status: 502 },
    );
  }
}
