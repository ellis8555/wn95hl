"use client";

import "./globals.css";

// hook imports
import { useState, createContext } from "react";

// component imports
import Navbar from "@/components/server/Navbar";

export const GetAuthorizationStatus = createContext();

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export default function RootLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

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
