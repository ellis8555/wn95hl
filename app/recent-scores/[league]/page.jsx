import GameResultsContainer from "@/components/client/Boxscore/GameResultsContainer";
import { getRecentGameResults } from "@/app/(helpers)/get-recent-game-results";

import {
  MOST_RECENT_SEASON,
  MOST_RECENT_Q_SEASON,
  MOST_RECENT_V_SEASON,
  MOST_RECENT_P_SEASON
} from "@/utils/constants/constants";

export const revalidate = 0;

async function page({ params }) {
  const league = params.league;
  // set season number dependant on which league
  let latestSeason;
  switch (league) {
    case "w":
      latestSeason = MOST_RECENT_SEASON;
      break;
    case "q":
      latestSeason = MOST_RECENT_Q_SEASON;
      break;
    case "v":
      latestSeason = MOST_RECENT_V_SEASON;
      break;
    case "p":
      latestSeason = MOST_RECENT_P_SEASON;
      break;
  }
  // fetch most recent games
  const gameData = JSON.parse(await getRecentGameResults(league, latestSeason));

  const { recentlyPlayedGames, totalGamesSubmitted } = gameData;
  const currentIndex = totalGamesSubmitted - 8;
  return (
    <div>
      <h1 className="text-xl text-center text-orange-400 my-3 md:text-3xl md:my-6">
        {`Recent Scores ${league.toUpperCase()}`}
      </h1>
      <GameResultsContainer
        recentGameResults={recentlyPlayedGames}
        totalGamesSubmitted={totalGamesSubmitted}
        currentIndex={currentIndex}
        leagueName={league}
        seasonNumber={latestSeason}
      />
    </div>
  );
}

export default page;
