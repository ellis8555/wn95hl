import "./globals.css";
import { LeagueStandingsProvider } from "@/context/FullLeagueStandingsContext";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export const revalidate = 1;

export default function RootLayout({ children, recentScores, standings }) {
  return (
    <html lang="en">
      <body>
        <LeagueStandingsProvider>
          {children}
          {recentScores}
          {standings}
        </LeagueStandingsProvider>
      </body>
    </html>
  );
}
