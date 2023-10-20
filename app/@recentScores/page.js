import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import { Suspense } from "react";
import { MOST_RECENT_SEASON } from "@/utils/constants/constants";
import { connectToDb } from "@/utils/database";
import W_Season from "@/schemas/season/w_season";

async function getRecentGameResults(seasonNumber) {
  await connectToDb();

  const responseData = {};

  const doesSeasonExist = await W_Season.queryForIfSeasonExists(seasonNumber);
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  await W_Season.getFieldData(seasonNumber, "recent-results", responseData);

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
