import "./globals.css";
import Navbar from "@/components/client/Navbar/Navbar";
import { LeagueStandingsProvider } from "@/context/FullLeagueStandingsContext";
import { UserAuthContextProvider } from "@/context/UserAuthContext";
import RecentScoresTicker from "@/components/client/Boxscore/RecentScoresTicker";
import { getRecentGameResults } from "./(helpers)/get-recent-game-results";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const metadata = {
  title: "NHL 95",
  description: "Standings for NHL 95",
};

export const revalidate = 0;

export default async function RootLayout({ children }) {
  const gameData = JSON.parse(
    await getRecentGameResults(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );

  const { recentlyPlayedGames } = gameData;

  return (
    <html lang="en">
      <body className="bg-slate-700">
        <UserAuthContextProvider>
          <LeagueStandingsProvider>
            <div className="text-slate-300 mb-[1px] overflow-hidden">
              <RecentScoresTicker recentGameResults={recentlyPlayedGames} />
            </div>
            <Navbar />
            {children}
          </LeagueStandingsProvider>
        </UserAuthContextProvider>
      </body>
    </html>
  );
}
