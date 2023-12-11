import TeamLogo from "@/components/server/standings/TeamLogo";
import Club from "@/schemas/club";
import { LEAGUE_SCHEMA_SWITCH } from "@/utils/constants/data-calls/db_calls";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

async function page({ params }) {
  const teamAcronym = params["team-Acronym"];

  const getClub = await Club.queryClubDetail(
    "teamAcronym",
    teamAcronym,
    "name"
  );

  // get teams full name
  let teamName;
  let teamNickname;
  const clubData = await Club.queryOneClub(getClub);
  teamName = clubData["name"];
  teamNickname = clubData["nickname"];

  // get correct league schema
  const League = await LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE);

  // get teams record
  const teamsRecord = await League.getSingleTeamStandings(
    MOST_RECENT_SEASON,
    teamAcronym
  );

  // get teams games for the season
  const teamsGames = await League.getTeamsGames(
    MOST_RECENT_SEASON,
    teamAcronym
  );

  // get how many season games team has played
  const totalGamesPlayed = teamsGames.length;

  // get last 10 games played OR last games played if less than 10 played
  let recentGames = [];
  if (totalGamesPlayed < 11) {
    recentGames = teamsGames;
  } else {
    recentGames = teamsGames.slice(totalGamesPlayed - 10);
  }

  // seperate home/away games into seperate arrays
  const homeGames = teamsGames.filter(
    (game) => game.otherGameStats.homeTeam == teamAcronym
  );
  const awayGames = teamsGames.filter(
    (game) => game.otherGameStats.awayTeam == teamAcronym
  );

  return (
    <div className="text-slate-300">
      <div className="flex flex-row justify-center gap-4 mt-4 w-4/6 mx-auto sm:w-full">
        <div className="flex justify-center">
          <TeamLogo name={teamAcronym} width={100} height={100} />
        </div>
        <div className="my-auto">
          <div className="text-center text-3xl">{`${teamName} ${teamNickname}`}</div>
          <div className="text-center">{`( ${teamsRecord.W} - ${teamsRecord.L} - ${teamsRecord.T} - ${teamsRecord.OTL} )`}</div>
        </div>
      </div>
      <div className="text-center text-xl mt-8">Current streak</div>
      <div className="flex flex-row justify-center gap-1">
        {recentGames.map((game) => {
          let bgColor;
          let result;
          if (game.otherGameStats.losingTeam == teamAcronym) {
            if (game.otherGameStats.overtimeLossTeam == teamAcronym) {
              bgColor = "bg-orange-600";
              result = "OTL";
            } else {
              bgColor = "bg-red-600";
              result = "L";
            }
          } else if (
            game.otherGameStats.homeTeamPoints == 1 &&
            game.otherGameStats.awayTeamPoints == 1
          ) {
            bgColor = "bg-slate-200";
            result = "T";
          } else {
            bgColor = "bg-green-600";
            result = "W";
          }
          return (
            <div
              key={game._id}
              className={`flex justify-center border border-slate-300 p-1 my-4 w-10 ${bgColor}`}
            >
              {result}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default page;
