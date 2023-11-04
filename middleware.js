import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "./utils/constants/constants";

export async function middleware(req) {
  const isAuthenticated = req.cookies.has(AUTH_COOKIE);
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  NextResponse.next();
}

export const config = {
  matcher: "/dashboard",
};
