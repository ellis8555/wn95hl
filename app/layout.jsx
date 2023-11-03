import "./globals.css";
import Navbar from "@/components/client/Navbar/Navbar";
import { LeagueStandingsProvider } from "@/context/FullLeagueStandingsContext";
import { UserAuthContextProvider } from "@/context/UserAuthContext";
import Boxscore from "@/components/client/Boxscore/Boxscore";
import GameResultScore from "@/components/client/Boxscore/GameResultScore";
import { getRecentGameResults } from "./(helpers)/get-recent-game-results";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export const revalidate = 0;

export default async function RootLayout({ children }) {
  const recentlyPlayedGames = JSON.parse(
    await getRecentGameResults(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );

  return (
    <html lang="en">
      <body className="bg-slate-700">
        <UserAuthContextProvider>
          <LeagueStandingsProvider>
            <div className="text-slate-300 mb-[1px]">
              <Boxscore recentGameResults={recentlyPlayedGames} />
              <div className="sm:hidden">
                <GameResultScore recentGameResults={recentlyPlayedGames} />
              </div>
            </div>
            <Navbar />
            {children}
          </LeagueStandingsProvider>
        </UserAuthContextProvider>
      </body>
    </html>
  );
}
