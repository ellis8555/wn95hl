import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "./utils/constants/constants";

export async function middleware(req, res) {
  const isAuthenticated = req.cookies.has(AUTH_COOKIE);
  const url = new URL(req.url)
  const path = url.pathname

  // list of routes that are protected
  const protectedPaths = ["/dashboard", "/reverse-submit", "/edit-boxscore"];
  // returns unauthorized user to login page if not authorized and on one of the above protected paths
  if (protectedPaths.includes(path) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  // prevents users already logged in being able to navigate to the login page
  if(path == "/login" && isAuthenticated){
    return NextResponse.redirect(new URL("/logout", req.url));
  }

  NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard", "/reverse-submit", "/edit-boxscore"],
};
