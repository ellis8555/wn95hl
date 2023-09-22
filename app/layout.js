"use client";

import "./globals.css";

// hook imports
import { UserAuthContextProvider } from "@/context/userAuthContext";

// component imports
import Navbar from "@/components/server/Navbar";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserAuthContextProvider>
          <Navbar />
          {children}
        </UserAuthContextProvider>
      </body>
    </html>
  );
}
