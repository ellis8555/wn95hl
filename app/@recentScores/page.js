import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { READ_SEASON_FIELD_DATA } from "@/utils/constants/api_consts";
import { connectToDb } from "@/utils/database";

export const revalidate = 10;

async function getRecentGameResults(leagueName, seasonNumber) {
  await connectToDb();

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
      <Boxscore recentGameResults={recentlyPlayedGames} />
      <div className="sm:hidden">
        <div className="text-xl text-center my-4">Latest result</div>
        <GameResultScore recentGameResults={recentlyPlayedGames} />
      </div>
    </>
  );
}

export default recentScores;
