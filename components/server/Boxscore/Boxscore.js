import Ticker from "./Ticker";

function Boxscore({ recentGameResults }) {
  let gamesDate;
  let gamesDay;
  const gameDates = [0];

  if (recentGameResults.length > 0) {
    const firstGameTimestamp =
      recentGameResults[0].otherGameStats.submittedAt || new Date("2022-09-17");
    const firstGameTimestampInTicker = Date.parse(firstGameTimestamp);
    gamesDate = new Date(firstGameTimestampInTicker);
    gamesDay = gamesDate.getDate();
    recentGameResults.forEach((game, index) => {
      const gameTimestampTicker = Date.parse(
        game.otherGameStats.submittedAt || new Date("2022-09-17")
      );
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
    </>
  );
}

export default Boxscore;
