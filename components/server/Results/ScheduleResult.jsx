import FinalResult from "./FinalResult";
import TeamLogo from "../Logos/TeamLogo";

const widthHeight = 40;

function ScheduleResult({ teamAcronym, games, leagueName, seasonNumber }) {
  return (
    <div className="flex flex-col">
      {games.map((game, index) => {
        const goalsByEachTeam = [];
        if (game["otherGameStats"]["missingState"] == undefined) {
          goalsByEachTeam.push(game["homeTeamGameStats"]["HomeGOALS"]);
          goalsByEachTeam.push(game["awayTeamGameStats"]["AwayGOALS"]);
          goalsByEachTeam.sort((a, b) => b - a);
          return (
            <div key={game._id} className="flex flex-row gap-4">
              {game["otherGameStats"]["homeTeam"] === teamAcronym ? (
                <div className="flex flex-row items-center gap-4">
                  <FinalResult teamAcronym={teamAcronym} game={game} />
                  <TeamLogo
                    name={game["otherGameStats"]["awayTeam"]}
                    width={widthHeight}
                    height={widthHeight}
                    leagueName={leagueName}
                    seasonNumber={seasonNumber}
                  />
                  <div className="text-lg">{`${goalsByEachTeam[0]} - ${goalsByEachTeam[1]}`}</div>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-4">
                  <FinalResult teamAcronym={teamAcronym} game={game} />
                  <TeamLogo
                    name={game["otherGameStats"]["homeTeam"]}
                    width={widthHeight}
                    height={widthHeight}
                    leagueName={leagueName}
                    seasonNumber={seasonNumber}
                  />
                  <div className="text-lg">{`${goalsByEachTeam[0]} - ${goalsByEachTeam[1]}`}</div>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div key={index} className="flex flex-row gap-4 justify-center">
              <div className="flex flex-row items-center gap-4 py-1">
                <TeamLogo
                  name={
                    game["otherGameStats"]["awayTeam"] ??
                    game["otherGameStats"]["homeTeam"]
                  }
                  width={widthHeight}
                  height={widthHeight}
                  leagueName={leagueName}
                  seasonNumber={seasonNumber}
                />
                <span className="text-md text-orange-400"> *</span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default ScheduleResult;
