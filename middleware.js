import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "./utils/constants/constants";

export async function middleware(request) {
  const hasCookie = request.cookies.has(AUTH_COOKIE);

  if (!hasCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  NextResponse.next();
}

export const config = {
  matcher: "/dashboard",
};
