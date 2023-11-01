import "./globals.css";
import Navbar from "@/components/client/Navbar/Navbar";
import { LeagueStandingsProvider } from "@/context/FullLeagueStandingsContext";
import { UserAuthContextProvider } from "@/context/UserAuthContext";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export const revalidate = 0;

export default function RootLayout({ children, recentScores }) {
  return (
    <html lang="en">
      <body className="bg-slate-700">
        <UserAuthContextProvider>
          <LeagueStandingsProvider>
            {recentScores}
            <Navbar />
            {children}
          </LeagueStandingsProvider>
        </UserAuthContextProvider>
      </body>
    </html>
  );
}
