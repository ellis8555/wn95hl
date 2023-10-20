import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  LEAGUE_SCHEMA_SWITCH,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { connectToDb } from "@/utils/database";
import W_Season from "@/schemas/season/w_season";

export const dynamic = "force-dynamic";

async function getRecentGameResults(seasonNumber) {
  await connectToDb();

  const responseData = {};

  const League = LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE, W_Season);

  const doesSeasonExist = await League.queryForIfSeasonExists(seasonNumber);
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  await League.getFieldData(seasonNumber, "recent-results", responseData);

  return JSON.stringify(responseData);
}

async function recentScores() {
  const { recentlyPlayedGames } = JSON.parse(
    await getRecentGameResults(MOST_RECENT_SEASON)
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
