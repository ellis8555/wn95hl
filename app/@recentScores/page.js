import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
  API_READ_SEASON_DATA,
} from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

const recentGameResults = await API_READ_SEASON_DATA(
  DOMAIN,
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
  "recent-results"
);

async function recentScores() {
  return (
    <>
      <Suspense fallback={<p>Loading recent results...</p>}>
        <Boxscore recentGameResults={recentGameResults} />
      </Suspense>
      <div className="sm:hidden">
        <div className="text-xl text-center my-4">Latest result</div>
        <Suspense fallback={<p>Processing game...</p>}>
          <GameResultScore recentGameResults={recentGameResults} />
        </Suspense>
      </div>
    </>
  );
}

export default recentScores;
