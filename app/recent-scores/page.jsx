import GameResults from "@/components/client/Boxscore/GameResults";
import { getRecentGameResults } from "../(helpers)/get-recent-game-results";

import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const revalidate = 0;

async function page() {
  // fetch most recent games
  const recentlyPlayedGames = JSON.parse(
    await getRecentGameResults(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );
  return (
    <div>
      <h1 className="text-xl text-center text-orange-400 my-3 md:text-3xl md:my-6">
        Recent Scores
      </h1>
      <GameResults
        recentGameResults={recentlyPlayedGames}
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={MOST_RECENT_SEASON}
      />
    </div>
  );
}

export default page;
