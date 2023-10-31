import "./globals.css";
import { LeagueStandingsProvider } from "@/context/FullLeagueStandingsContext";
import Navbar from "@/components/server/Navbar/Navbar";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export const revalidate = 0;

export default function RootLayout({ children, recentScores, standings }) {
  return (
    <html lang="en">
      <body>
        <LeagueStandingsProvider>
          <Navbar />
          {children}
          {recentScores}
          {standings}
        </LeagueStandingsProvider>
      </body>
    </html>
  );
}
