import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  await connectDB();

  return User.findById(payload.userId);
}

// GET playlist
export async function GET() {
  const user = await getUser();
  if (!user)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  return NextResponse.json({ data: user.playlist });
}

// ADD
export async function POST(req) {
  const user = await getUser();
  if (!user)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  const body = await req.json();

  const exists = user.playlist.some(
    (t) => t.trackId === body.trackId
  );

  if (!exists) {
    user.playlist.push(body);
    await user.save();
  }

  return NextResponse.json({ message: "added" });
}

// DELETE
export async function DELETE(req) {
  const user = await getUser();
  if (!user)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("trackId"));

  user.playlist = user.playlist.filter(
    (t) => t.trackId !== id
  );

  await user.save();

  return NextResponse.json({ message: "removed" });
}