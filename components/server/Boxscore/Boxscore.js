import Ticker from "./Ticker";
import GameResultScore from "./GameResultScore";

function Boxscore({ recentGameResults, isStateUploaded }) {
  let gamesDate;
  let gamesDay;
  const gameDates = [0];

  if (recentGameResults.length > 0) {
    const firstGameTimestampInTicker = Date.parse(
      recentGameResults[0].createdAt
    );
    gamesDate = new Date(firstGameTimestampInTicker);
    gamesDay = gamesDate.getDate();
    recentGameResults.forEach((game, index) => {
      const gameTimestampTicker = Date.parse(game.createdAt);
      const thisGamesDate = new Date(gameTimestampTicker);
      const thisGamesDay = thisGamesDate.getDate();

      if (thisGamesDay != gamesDay) {
        gameDates.push(index);
        gamesDay = thisGamesDay;
      }
    });
  }

  return (
    <>
      {/* entire score ticker container */}
      <div className="hidden sm:flex flex-row justify-center my-4 gap-1">
        {recentGameResults.map((game, index) => (
          <Ticker
            gameData={game}
            index={index}
            gameDateIndexes={gameDates}
            key={index}
          />
        ))}
      </div>
      {isStateUploaded && (
        <div className="flex sm:hidden flex-row justify-center my-4 gap-1">
          <GameResultScore recentGameResults={recentGameResults} />
        </div>
      )}
    </>
  );
}

export default Boxscore;
