import GameResultScore from "@/components/client/Boxscore/GameResultScore";
import { getRecentGameResults } from "../(helpers)/get-recent-game-results";

import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const revalidate = 0;

async function page() {
  const recentlyPlayedGames = JSON.parse(
    await getRecentGameResults(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );
  return (
    <div>
      <h1 className="text-3xl text-center text-slate-300">Recent Scores</h1>
      {recentlyPlayedGames.map((gameResult, index) => (
        <GameResultScore key={index} recentGameResult={gameResult} />
      ))}
    </div>
  );
}

export default page;
