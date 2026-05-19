import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Routes that require authentication
const PROTECTED_ROUTES = ["/yourlist"];

// Routes that logged-in users should NOT access (auth pages)
const AUTH_ROUTES = ["/signin", "/signup"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isLoggedIn = !!payload;

  // Redirect logged-in users away from signin/signup
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/yourlist/:path*", "/signin", "/signup"],
};