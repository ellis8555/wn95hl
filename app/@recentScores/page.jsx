import Boxscore from "@/components/client/Boxscore/Boxscore";
import GameResultScore from "@/components/client/Boxscore/GameResultScore";
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
    <div className="text-slate-300 mb-[1px]">
      <Boxscore recentGameResults={recentlyPlayedGames} />
      <div className="sm:hidden">
        <GameResultScore recentGameResults={recentlyPlayedGames} />
      </div>
    </div>
  );
}

export default recentScores;
