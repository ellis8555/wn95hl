import GameResultsContainer from "@/components/client/Boxscore/GameResultsContainer";
import { getGameResults } from "@/app/(helpers)/get-game-results";

export const revalidate = 0;

async function page({ params }) {
  const leagueName = params["league"];
  const seasonNumber = params["season-number"];
  const gamesIndexNumber = +params["game-index"];

  // fetch most recent games
  const gameData = JSON.parse(
    await getGameResults(leagueName, seasonNumber, gamesIndexNumber)
  );

  const { selectedGames, totalGamesSubmitted } = gameData;
  return (
    <div>
      <h1 className="text-xl text-center text-orange-400 my-3 md:text-3xl md:my-6">
        Recent Scores
      </h1>
      <GameResultsContainer
        recentGameResults={selectedGames}
        totalGamesSubmitted={totalGamesSubmitted}
        currentIndex={gamesIndexNumber}
        leagueName={leagueName}
        seasonNumber={seasonNumber}
      />
    </div>
  );
}

export default page;
