import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "adele";
  const limit = searchParams.get("limit") || "1000";

  try {
    const res = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}`
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Deezer non-JSON response:", text.slice(0, 100));
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Deezer fetch error:", err.message);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}