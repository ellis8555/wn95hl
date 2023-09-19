import "./globals.css";

// component imports
import Navbar from "@/components/server/Navbar";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
