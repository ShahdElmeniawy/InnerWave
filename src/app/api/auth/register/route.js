import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return NextResponse.json(
        { errors: { email: "This email is already registered" } },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Create token
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Response
    const response = NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    // Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}