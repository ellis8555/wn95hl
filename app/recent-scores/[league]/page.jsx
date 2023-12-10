import GameResultsContainer from "@/components/client/Boxscore/GameResultsContainer";
import { getRecentGameResults } from "@/app/(helpers)/get-recent-game-results";

import { MOST_RECENT_SEASON } from "@/utils/constants/constants";

export const revalidate = 0;

async function page({ params }) {
  const league = params.league;
  // fetch most recent games
  const gameData = JSON.parse(
    await getRecentGameResults(league, MOST_RECENT_SEASON)
  );

  const { recentlyPlayedGames, totalGamesSubmitted } = gameData;
  const currentIndex = totalGamesSubmitted - 8;
  return (
    <div>
      <h1 className="text-xl text-center text-orange-400 my-3 md:text-3xl md:my-6">
        Recent Scores
      </h1>
      <GameResultsContainer
        recentGameResults={recentlyPlayedGames}
        totalGamesSubmitted={totalGamesSubmitted}
        currentIndex={currentIndex}
        leagueName={league}
        seasonNumber={MOST_RECENT_SEASON}
      />
    </div>
  );
}

export default page;
