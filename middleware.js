import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "./utils/constants/constants";

export async function middleware(req, res) {
  const isAuthenticated = req.cookies.has(AUTH_COOKIE);
  const path = req.nextUrl.pathname

  // returns unauthorized user to login page if not authorized and on one of the above protected paths
  if (req.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  // prevents users already logged in being able to navigate to the login page
  if(path == "/login" && isAuthenticated){
    return NextResponse.redirect(new URL("/logout", req.url));
  }

  NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard", "/dashboard/reverse-submit", "/dashboard/csv-request","/edit-boxscore"],
};
