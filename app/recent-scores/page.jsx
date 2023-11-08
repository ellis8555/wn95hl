import GameResultScore from "@/components/client/Boxscore/GameResultScore";
import { getRecentGameResults } from "../(helpers)/get-recent-game-results";

import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const revalidate = 0;

// fetch most recent games
const recentlyPlayedGames = JSON.parse(
  await getRecentGameResults(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
);

// determine which games were submitted on different dates
let gamesDate;
let gamesDay;
// game that has a different date than the previous game will have it's index pushed into this array
const gameDates = [0];

if (recentlyPlayedGames.length > 0) {
  const firstGameTimestamp =
    recentlyPlayedGames[0].otherGameStats.submittedAt || new Date("2022-09-17");
  const firstGameTimestampInTicker = Date.parse(firstGameTimestamp);
  gamesDate = new Date(firstGameTimestampInTicker);
  gamesDay = gamesDate.getDate();
  recentlyPlayedGames.forEach((game, index) => {
    const gameTimestampTicker = Date.parse(
      game.otherGameStats.submittedAt || new Date("1970-01-01")
    );
    const thisGamesDate = new Date(gameTimestampTicker);
    const thisGamesDay = thisGamesDate.getDate();

    if (thisGamesDay != gamesDay) {
      gameDates.push(index);
      gamesDay = thisGamesDay;
    }
  });
}

async function page() {
  return (
    <div>
      <h1 className="text-xl text-center text-slate-300 my-3 md:text-3xl md:my-6">
        Recent Scores
      </h1>
      {recentlyPlayedGames.map((gameResult, index) => (
        <GameResultScore
          key={index}
          index={index}
          recentGameResult={gameResult}
          gameDateIndexes={gameDates}
        />
      ))}
    </div>
  );
}

export default page;
