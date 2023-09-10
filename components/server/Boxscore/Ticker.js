import TeamLogo from "../standings/TeamLogo";

function Ticker({ gameData }) {
  if (
    gameData !== undefined &&
    gameData !== null &&
    Object.keys(gameData).length !== 0
  ) {
    const homeData = gameData.homeTeamGameStats;
    const awayData = gameData.awayTeamGameStats;
    const otherData = gameData.otherGameStats;
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
        {/* inside ticker container */}
        <div className="flex flex-row w-28 p-1 border border-black">
          {/* actual score tickers container */}
          <div className="flex flex-col">
            {/* away team */}
            <div className="flex flex-row gap-4 items-center">
              <div>
                <TeamLogo name={awayAcronym} width={30} height={30} />
              </div>
              <div>
                <div>{awayScore}</div>
              </div>
            </div>
            {/* home team */}
            <div>
              <div className="flex flex-row gap-4 items-center">
                <div>
                  <TeamLogo name={homeAcronym} width={30} height={30} />
                </div>
                <div>
                  <div>{homeScore}</div>
                </div>
              </div>
            </div>
          </div>
          {!wasGameATie && wasOvertimeRequired ? (
            <div className="flex flex-col justify-center mx-auto">OT</div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

export default Ticker;
