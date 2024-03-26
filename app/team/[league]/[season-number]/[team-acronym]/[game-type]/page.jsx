import Link from "next/link";
import { connectToDb } from "@/utils/database";
import TeamLogoNoLink from "@/components/server/Logos/TeamLogoNoLink";
import FinalResult from "@/components/server/Results/FinalResult";
import ScheduleResult from "@/components/server/Results/ScheduleResult";
import Club from "@/schemas/club";
import {
  LEAGUE_SCHEMA_SWITCH,
  LEAGUE_GAMES_SCHEMA_SWITCH,
} from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

const dbCallFrom = "team/[league]/[season-number]/[team-acronym]";

async function page({ params }) {
  const leagueName = params["league"];
  const seasonNumber = +params["season-number"];
  const teamAcronym = params["team-acronym"];
  const gameType = params["game-type"];

  await connectToDb(dbCallFrom);
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
  const League = await LEAGUE_SCHEMA_SWITCH(leagueName);

  // get teams record
  const teamsRecord = await League.getSingleTeamStandings(
    seasonNumber,
    teamAcronym
  );

  // get correct league schema
  const Games = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);

  // get teams games for the season
  const teamsGames = await Games.getTeamsGames(
    seasonNumber,
    gameType,
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

  // look for missing game states or odd number of played games in order to layout results page nicely

  // get list of home team opponents
  const homeGameOpponents = homeGames
    .map((opponent) => {
      return opponent["otherGameStats"]["awayTeam"];
    })
    .sort();

  // get list of away team opponents
  const awayGameOpponents = awayGames
    .map((opponent) => {
      return opponent["otherGameStats"]["homeTeam"];
    })
    .sort();

  // get missing home opponents
  const missingHomeOpponents = [];
  const missingHomeOpponentsIndex = [];

  // set cursor to keep track of where in the array to begin the next search iteration
  let awayGameOpponentsCursor = 0;
  // method to run through away opponents to compare with home opponents
  // which will find missing home games
  function addMissingHomeOpponents() {
    for (
      awayGameOpponentsCursor;
      awayGameOpponentsCursor < awayGameOpponents.length;
      awayGameOpponentsCursor++
    ) {
      if (
        homeGameOpponents[awayGameOpponentsCursor] !==
        awayGameOpponents[awayGameOpponentsCursor]
      ) {
        missingHomeOpponents.push(awayGameOpponents[awayGameOpponentsCursor]);
        missingHomeOpponentsIndex.push(awayGameOpponentsCursor);
        homeGameOpponents.splice(
          awayGameOpponentsCursor,
          0,
          awayGameOpponents[awayGameOpponentsCursor]
        );
        break;
      }
    }
  }

  while (awayGameOpponentsCursor < awayGameOpponents.length) {
    addMissingHomeOpponents();
  }

  // get missing away opponents
  const missingAwayOpponents = [];
  const missingAwayOpponentsIndex = [];

  // set cursor to keep track of where in the array to begin the next search iteration
  let homeGameOpponentsCursor = 0;
  // method to run through away opponents to compare with home opponents
  // which will find missing away games
  function addMissingAwayOpponents() {
    for (
      homeGameOpponentsCursor;
      homeGameOpponentsCursor < homeGameOpponents.length;
      homeGameOpponentsCursor++
    ) {
      if (
        awayGameOpponents[homeGameOpponentsCursor] !==
        homeGameOpponents[homeGameOpponentsCursor]
      ) {
        missingAwayOpponents.push(homeGameOpponents[homeGameOpponentsCursor]);
        missingAwayOpponentsIndex.push(homeGameOpponentsCursor);
        awayGameOpponents.splice(
          homeGameOpponentsCursor,
          0,
          homeGameOpponents[homeGameOpponentsCursor]
        );
        break;
      }
    }
  }

  while (homeGameOpponentsCursor < homeGameOpponents.length) {
    addMissingAwayOpponents();
  }

  // end adding missing home/away opponents

  // get home record
  const homeRecord = {
    W: 0,
    L: 0,
    T: 0,
    OTL: 0,
  };

  homeGames.forEach((homeGame) => {
    // check for win
    if (homeGame["otherGameStats"]["winningTeam"] === teamAcronym) {
      homeRecord["W"] += 1;
      return;
    }
    // check for regulation loss
    else if (
      homeGame["otherGameStats"]["losingTeam"] === teamAcronym &&
      !homeGame["otherGameStats"]["overtimeRequired"]
    ) {
      homeRecord["L"] += 1;
      return;
    }
    // check for overtimes loss
    else if (
      homeGame["otherGameStats"]["losingTeam"] === teamAcronym &&
      homeGame["otherGameStats"]["overtimeRequired"]
    ) {
      homeRecord["OTL"] += 1;
      return;
    }
    // return tie game
    else {
      homeRecord["T"] += 1;
    }
  });

  // get away record
  const awayRecord = {
    W: 0,
    L: 0,
    T: 0,
    OTL: 0,
  };

  awayGames.forEach((awayGame) => {
    // check for win
    if (awayGame["otherGameStats"]["winningTeam"] === teamAcronym) {
      awayRecord["W"] += 1;
      return;
    }
    // check for regulation loss
    else if (
      awayGame["otherGameStats"]["losingTeam"] === teamAcronym &&
      !awayGame["otherGameStats"]["overtimeRequired"]
    ) {
      awayRecord["L"] += 1;
      return;
    }
    // check for overtimes loss
    else if (
      awayGame["otherGameStats"]["losingTeam"] === teamAcronym &&
      awayGame["otherGameStats"]["overtimeRequired"]
    ) {
      awayRecord["OTL"] += 1;
      return;
    }
    // return tie game
    else {
      awayRecord["T"] += 1;
    }
  });

  // insert missing states into games list which creates a smoother layout in teams results page

  // home games updated with missing opponents
  missingHomeOpponentsIndex.forEach((homeOpponent, index) => {
    const missingGameObject = {
      otherGameStats: {
        missingState: true,
        awayTeam: missingHomeOpponents[index],
      },
    };
    homeGames.push(missingGameObject);
  });

  // away games updated with missing opponents
  missingAwayOpponentsIndex.forEach((awayOpponent, index) => {
    const missingGameObject = {
      otherGameStats: {
        missingState: true,
        homeTeam: missingAwayOpponents[index],
      },
    };
    awayGames.push(missingGameObject);
  });

  // sort games by opposing teams alphabetical order
  homeGames.sort((a, b) =>
    a["otherGameStats"]["awayTeam"].localeCompare(
      b["otherGameStats"]["awayTeam"]
    )
  );
  awayGames.sort((a, b) =>
    a["otherGameStats"]["homeTeam"].localeCompare(
      b["otherGameStats"]["homeTeam"]
    )
  );

  // trim insertions where both sides of results are just team logos
  homeGames.forEach((homeGame, index) => {
    if (
      homeGame.otherGameStats.missingState === true &&
      awayGames[index].otherGameStats.missingState === true
    ) {
      homeGames.splice(index, 1);
      awayGames.splice(index, 1);
    }
  });

  awayGames.forEach((awayGame, index) => {
    if (
      awayGame.otherGameStats.missingState === true &&
      homeGames[index].otherGameStats.missingState === true
    ) {
      awayGames.splice(index, 1);
      homeGames.splice(index, 1);
    }
  });

  return (
    <div className="text-slate-300">
      <div className="flex flex-row justify-center gap-4 mt-4 w-4/6 mx-auto sm:w-full">
        <div className="flex justify-center">
          <TeamLogoNoLink name={teamAcronym} width={100} height={100} />
        </div>
        <div className="my-auto">
          <div className="text-center text-3xl">{`${teamName} ${teamNickname}`}</div>
          <div className="text-center text-sm md:text-lg">{`( ${teamsRecord.W} - ${teamsRecord.L} - ${teamsRecord.T} - ${teamsRecord.OTL} )`}</div>
        </div>
      </div>
      {/* <div className="text-center text-xl mt-8">Current streak</div> */}
      <div className="flex flex-row justify-center gap-1">
        {recentGames.map((game) => {
          return (
            <Link key={game._id} href={`/boxscores/${leagueName}/${seasonNumber}/${game._id}`}>
              <FinalResult key={game._id} teamAcronym={teamAcronym} game={game} />
            </Link>
          );
        })}
      </div>
      {/* Game results going here */}
      <div className="flex flex-row gap-4 justify-evenly w-full md:w-3/4 mx-auto">
        <div>
          <div className="text-center text-xl">Home</div>
          <div className="text-center text-sm md:text-lg mb-4">
            {`( ${homeRecord.W} - ${homeRecord.L} - ${homeRecord.T} - ${homeRecord.OTL} )`}
            {missingHomeOpponents.length > 0 && (
              <span className="text-orange-400"> *</span>
            )}
          </div>
          <ScheduleResult
            teamAcronym={teamAcronym}
            games={homeGames}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
          />
        </div>
        <div>
          <div className="text-center text-xl">Away</div>
          <div className="text-center text-sm md:text-lg mb-4">
            {`( ${awayRecord.W} - ${awayRecord.L} - ${awayRecord.T} - ${awayRecord.OTL} )`}
            {missingAwayOpponents.length > 0 && (
              <span className="text-orange-400"> *</span>
            )}
          </div>
          <ScheduleResult
            teamAcronym={teamAcronym}
            games={awayGames}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
