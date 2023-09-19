import Ticker from "./Ticker";
import GameResultScore from "./GameResultScore";

function Boxscore({ recentGameResults, isStateUploaded }) {
  return (
    <>
      {/* entire score ticker container */}
      <div className="hidden sm:flex flex-row justify-center my-4 gap-1">
        {recentGameResults.map((game, index) => (
          <Ticker gameData={game} key={index} />
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
