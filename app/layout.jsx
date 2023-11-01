import "./globals.css";
import Navbar from "@/components/server/Navbar/Navbar";
import { LeagueStandingsProvider } from "@/context/FullLeagueStandingsContext";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export const revalidate = 0;

export default function RootLayout({ children, recentScores }) {
  return (
    <html lang="en">
      <body className="bg-slate-700">
        <LeagueStandingsProvider>
          {recentScores}
          <Navbar />
          {children}
        </LeagueStandingsProvider>
      </body>
    </html>
  );
}
