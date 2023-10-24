import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import { getRecentGameResults } from "./(helpers)/get-recent-game-results";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

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
