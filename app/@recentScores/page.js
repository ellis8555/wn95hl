import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { READ_SEASON_FIELD_DATA } from "@/utils/constants/api_consts";

export const dynamic = "force-dynamic";

async function getRecentGameResults(leagueName, seasonNumber) {
  const { recentlyPlayedGames } = await READ_SEASON_FIELD_DATA(
    leagueName,
    seasonNumber,
    "recent-results"
  );

  return JSON.stringify(recentlyPlayedGames);
}

async function recentScores() {
  const recentlyPlayedGames = JSON.parse(
    await getRecentGameResults(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );
  return (
    <>
      <Suspense fallback={<p>Loading recent results...</p>}>
        <Boxscore recentGameResults={recentlyPlayedGames} />
      </Suspense>
      <div className="sm:hidden">
        <div className="text-xl text-center my-4">Latest result</div>
        <Suspense fallback={<p>Processing game...</p>}>
          <GameResultScore recentGameResults={recentlyPlayedGames} />
        </Suspense>
      </div>
    </>
  );
}

export default recentScores;
