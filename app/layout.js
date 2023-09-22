"use client";

import "./globals.css";
import { AUTH_COOKIE } from "@/utils/constants";

// hook imports
import { useState, createContext, useEffect } from "react";

// component imports
import Navbar from "@/components/server/Navbar";

export const GetAuthorizationStatus = createContext();

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export default function RootLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const getCookie = document.cookie;
    const isUserAuthCookie = getCookie.split("=")[0];
    if (isUserAuthCookie == AUTH_COOKIE) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [isAuthorized]);

  return (
    <html lang="en">
      <body>
        <GetAuthorizationStatus.Provider
          value={{ isAuthorized, setIsAuthorized }}
        >
          <Navbar />
          {children}
        </GetAuthorizationStatus.Provider>
      </body>
    </html>
  );
}
