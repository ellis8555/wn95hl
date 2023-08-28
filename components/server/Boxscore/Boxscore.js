import TeamLogo from "../standings/TeamLogo";

function Boxscore({ gameData }) {
  if (
    gameData !== undefined &&
    gameData !== null &&
    Object.keys(gameData).length !== 0
  ) {
    const homeData = gameData.data.homeTeamGameStats;
    const awayData = gameData.data.awayTeamGameStats;
    const otherData = gameData.data.otherGameStats;
    const boxscoreStats = {
      overtimeRequired: otherData.overtimeRequired,
      wasGameATie: otherData.wasGameATie,
      homeTeam: {
        acronym: otherData.homeTeam,
        homeScore: homeData.HomeGOALS,
      },
      awayTeam: {
        acronym: otherData.awayTeam,
        awayScore: awayData.AwayGOALS,
      },
    };

    const homeAcronym = boxscoreStats["homeTeam"]["acronym"];
    const homeScore = boxscoreStats["homeTeam"]["homeScore"];
    const awayAcronym = boxscoreStats["awayTeam"]["acronym"];
    const awayScore = boxscoreStats["awayTeam"]["awayScore"];
    const wasGameATie = boxscoreStats["wasGameATie"];
    const wasOvertimeRequired = boxscoreStats["overtimeRequired"];
    return (
      <>
        {!wasGameATie && wasOvertimeRequired && (
          <div className="text-center text-4xl">OT</div>
        )}
        <div className="w-full flex justify-center gap-3 items-center sm:w-1/2 sm:mx-auto">
          Home
          <TeamLogo name={homeAcronym} width={60} height={60} />
          <div className="text-4xl">
            {homeScore} - {awayScore}
          </div>
          <TeamLogo name={awayAcronym} width={60} height={60} />
          Away
        </div>
      </>
    );
  }

  return (
    <div className="w-full text-center bg-slate-200 mt-4 sm:w-3/4 sm:mx-auto">
      Submit a game state
    </div>
  );
}

export default Boxscore;
