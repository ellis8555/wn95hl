import Ticker from "./Ticker";

function Boxscore({ recentGameResults }) {
  return (
    // entire score ticker container
    <div className="hidden sm:flex flex-row justify-center my-4 gap-1">
      {recentGameResults.map((game, index) => (
        <Ticker gameData={game} key={index} />
      ))}
    </div>
  );
}

export default Boxscore;
