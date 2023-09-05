import { connectToDb } from "@/utils/database";
import queryClubDetatail from "@/utils/db-queries/query-one/club/query-club-detail";
import getTeamsStandingsIndex from "@/utils/tables/team-standings/get-teams-standings-index";
import incrementGamesPlayed from "@/utils/tables/team-standings/increment-games-played";
import incrementWinningTeamsWins from "@/utils/tables/team-standings/increment-winning-teams-wins";
import incrementLosingTeamsLosses from "@/utils/tables/team-standings/increment-losing-teams-losses";
import incrementTiesForTieGame from "@/utils/tables/team-standings/increment-ties-for-tie-game";
import incrementOvertimeLoss from "@/utils/tables/team-standings/increment-overtime-loss";
import incrementPointsForTeams from "@/utils/tables/team-standings/increment-points-for-teams";
import nextResponse from "@/utils/api/next-response";
import getSeasonsModel from "@/schemas/season/season";
import queryForIfSeasonExists from "@/utils/db-queries/query-one/season/query-for-a-season";

let db;

export const POST = async (req, res) => {
  const { currSeason, fileName, fileSize, data } = await req.json();
  let currentLeague;
  let currentSeason;
  // if the file is not of csv type then process a game state file
  if (!fileName.includes("WN95HL_Game_Stats.csv")) {
    // get currentSeason from the fileName if W league
    // sample file name WS9.state1
    if (fileName[0] === "W") {
      currentLeague = fileName[0];
      const getTheDot = fileName.indexOf(".");
      if (getTheDot == 3) {
        currentSeason = fileName[getTheDot - 1];
      }
      if (getTheDot == 4) {
        currentSeason = fileName[getTheDot - 2] + fileName[getTheDot - 1];
      }
    }
    // get currentSeason from the fileName if Q league
    // sample file name Q86.state1
    if (fileName[0] === "Q") {
      currentLeague = fileName[0];
      const getTheDot = fileName.indexOf(".");
      if (getTheDot == 3) {
        currentSeason = fileName[getTheDot - 2] + fileName[getTheDot - 1];
      }
    }
  }

  // if the file is of csv type then process
  if (fileName.includes("WN95HL_Game_Stats.csv")) {
    currentLeague = data.otherGameStats.league;
    currentSeason = currSeason;
  }

  // reject files that do match a set name
  // reject uploads that are to large
  // reject files that are not .csv filetype

  if (
    (fileName !== "WN95HL_Game_Stats.csv" && !fileName.includes("state")) ||
    (fileName === "WN95HL_Game_Stats.csv" && fileSize > 6500) ||
    (fileName.includes("state") && fileSize > 1400000)
  ) {
    return nextResponse(
      { message: "File was not uploaded. Criteria not met." },
      400,
      "POST"
    );
  }

  // check if game state is less than a full game. less than 15 mins or 3 periods

  const getGameLength = +data.otherGameStats["GAME LENGTH"].replace(":", "");
  if (getGameLength < 1500) {
    return nextResponse(
      {
        message: "This game appears to be less than 15 minutes played",
      },
      400,
      "POST"
    );
  }

  try {
    db = await connectToDb();

    // check that the seasons collection exists
    const doesSeasonExist = queryForIfSeasonExists(
      currentLeague,
      currentSeason
    );
    // if season does not exist exit
    if (!doesSeasonExist) {
      return nextResponse(
        {
          message: `There is no season ${currentSeason} registered`,
        },
        400,
        "POST"
      );
    }

    const getSeasonModel = getSeasonsModel(currentLeague);
    const Season = await getSeasonModel.findOne({
      seasonNumber: currentSeason,
    });

    ///////////////////////////////
    // get the data for this season
    ///////////////////////////////

    const getSeasonData = Season;
    const getSeasonGames = getSeasonData.seasonGames;
    const getSeasonStandings = getSeasonData.standings;
    const otherStats = data.otherGameStats;
    const getRegisteredTeams = getSeasonData.teams.map((team) => {
      return team.teamAcronym;
    });
    // check that file has not previously been uploaded
    let isDuplicate = false;
    const getUniqueGameId = otherStats.uniqueGameId;
    // loop through games that have been added to the database
    // checking for uniqueId hash for a match with the uploaded game file
    getSeasonGames.forEach((game) => {
      const gameId = game.otherGameStats.uniqueGameId;
      if (gameId === getUniqueGameId) {
        isDuplicate = true;
      }
    });

    ////////////////// TEMP DISABLED FOR TESTING ///////////////////////////////////////////////
    ////////////////// DUPLICATES ENABLED FOR DEMO ONLY ////////////////////////////////////////

    // if (isDuplicate) {
    //   return nextResponse(
    //     {
    //       message: `This game appears to be a duplicate. Game data was not saved..`,
    //     },
    //     400,
    //     "POST"
    //   );
    // }

    ////////////////////////// END OF TEMP DISABLED ////////////////////////////////////////////////

    ////////////////////////////////////////////
    // check teams submitted are in this league
    ////////////////////////////////////////////

    const homeTeamAbbr = otherStats.homeTeam;

    const homeTeamName = await queryClubDetatail(
      "teamAcronym",
      homeTeamAbbr,
      "name"
    );
    const awayTeamAbbr = otherStats.awayTeam;
    const awayTeamName = await queryClubDetatail(
      "teamAcronym",
      awayTeamAbbr,
      "name"
    );

    const checkHomeTeamIsRegistered = getRegisteredTeams.includes(homeTeamAbbr);
    const checkAwayTeamIsRegistered = getRegisteredTeams.includes(awayTeamAbbr);
    let notRegisteredMessage;
    if (!checkHomeTeamIsRegistered) {
      notRegisteredMessage = `${homeTeamName} is not registered in this league. Game was not sumbitted`;
    } else if (!checkAwayTeamIsRegistered) {
      notRegisteredMessage = `${awayTeamName} is not registered in this league. Game was not submitted`;
    } else {
      notRegisteredMessage =
        "Neither teams are registered for this league. Game was not submitted";
    }

    if (!checkHomeTeamIsRegistered || !checkAwayTeamIsRegistered) {
      return nextResponse(
        {
          message: notRegisteredMessage,
        },
        400,
        "POST"
      );
    }

    ////////////////////////////////
    // veryify schedules and update
    ///////////////////////////////
    let homeTeamsObjectIndex, awayTeamsObjectIndex;

    const getHomeTeamsSeasonObject = getSeasonData.teams.find((team, index) => {
      if (homeTeamAbbr === team.teamAcronym) {
        homeTeamsObjectIndex = index;
        return team;
      }
    });
    const getAwayTeamsSeasonObject = getSeasonData.teams.find((team, index) => {
      if (awayTeamAbbr === team.teamAcronym) {
        awayTeamsObjectIndex = index;
        return team;
      }
    });

    const getHomeTeamsHomeSchedule = getHomeTeamsSeasonObject.schedule.home;
    const getAwayTeamsHomeSchedule = getAwayTeamsSeasonObject.schedule.away;

    const extractHomeOpponent = +getHomeTeamsHomeSchedule.indexOf(awayTeamAbbr);
    const extractAwayOpponent = +getAwayTeamsHomeSchedule.indexOf(homeTeamAbbr);
    if (extractHomeOpponent == -1) {
      return nextResponse(
        {
          message: `${homeTeamName} does not have any games at home vs ${awayTeamName}`,
        },
        400,
        "POST"
      );
    }

    getHomeTeamsHomeSchedule.splice(extractHomeOpponent, 1);
    getAwayTeamsHomeSchedule.splice(extractAwayOpponent, 1);

    await getSeasonModel.updateOne(
      {
        _id: getSeasonData._id,
      },
      {
        $set: {
          [`teams.${homeTeamsObjectIndex}.schedule.home`]:
            getHomeTeamsHomeSchedule,
          [`teams.${awayTeamsObjectIndex}.schedule.away`]:
            getAwayTeamsHomeSchedule,
        },
      }
    );

    ///////////////////////////////////////////////////////////////
    // all checks passed and game file seems ready for submission
    ///////////////////////////////////////////////////////////////

    // check if season Start date has been set in the db
    // first game entry is the starting point for a season
    if (getSeasonData.startDate == null)
      await getSeasonModel.updateOne(
        {
          _id: getSeasonData._id,
        },
        {
          $set: {
            startDate: Date.now(),
          },
        }
      );

    // check if season end date needs to be set

    const getCurrentTotalGamesPlayed = getSeasonData.seasonGames.length;

    const getTotalGamesToBePlayed = +getSeasonData.totalGamesToBePlayed;

    // subtract one as this game state has yet to be added so the count will be less one at this point
    if (getCurrentTotalGamesPlayed === getTotalGamesToBePlayed - 1) {
      await getSeasonModel.updateOne(
        {
          _id: getSeasonData._id,
        },
        {
          $set: {
            endDate: Date.now(),
            hasSeasonEnded: true,
          },
        }
      );
    }

    // add the game file to season games array of game results to the database
    getSeasonGames.push(data);

    await getSeasonModel.updateOne(
      {
        _id: getSeasonData._id,
      },
      {
        $set: {
          seasonGames: getSeasonGames,
        },
      }
    );

    ///////////////////////////
    // update the league table
    ///////////////////////////

    // get data related to updating the standings

    const homeTeamPoints = +otherStats.homeTeamPoints;
    const awayTeamPoints = +otherStats.awayTeamPoints;
    const wasOvertimeRequired = otherStats.overtimeRequired;
    const wasGameATie = otherStats.wasGameATie;
    // get winning/losing teams if game was not a tie
    let winningTeam;
    let losingTeam;
    if (!wasGameATie) {
      winningTeam = await queryClubDetatail(
        "teamAcronym",
        otherStats.winningTeam,
        "name"
      );
      losingTeam = await queryClubDetatail(
        "teamAcronym",
        otherStats.losingTeam,
        "name"
      );
    }

    //////////////////////////////////////////////
    // assign index numbers to home and away teams
    // returns index number of home team
    //////////////////////////////////////////////

    const homeTeamsStandingIndex = getTeamsStandingsIndex(
      getSeasonStandings,
      homeTeamName
    );

    ////////////////////////////////////
    // returns index number of away team
    ////////////////////////////////////

    const awayTeamsStandingIndex = getTeamsStandingsIndex(
      getSeasonStandings,
      awayTeamName
    );

    ///////////////////////////////////////////
    // increase both teams games played by one
    ///////////////////////////////////////////

    incrementGamesPlayed(
      getSeasonStandings,
      homeTeamsStandingIndex,
      awayTeamsStandingIndex
    );

    ///////////////////////////////////////////////////
    // increase wins for winning team if game not tied
    ///////////////////////////////////////////////////

    incrementWinningTeamsWins(getSeasonStandings, wasGameATie, winningTeam);

    ///////////////////////////////////////////////////////////////////////
    // increase losses for losing team if game not tied or went to overtime
    ///////////////////////////////////////////////////////////////////////

    incrementLosingTeamsLosses(
      getSeasonStandings,
      wasGameATie,
      wasOvertimeRequired,
      losingTeam
    );

    /////////////////////////////////////////////////
    // increase tie field for both teams if game tied
    /////////////////////////////////////////////////

    incrementTiesForTieGame(
      getSeasonStandings,
      wasGameATie,
      homeTeamsStandingIndex,
      awayTeamsStandingIndex
    );

    ///////////////////////////////////////
    // otl for team that loses in overtime
    ///////////////////////////////////////

    incrementOvertimeLoss(
      getSeasonStandings,
      wasGameATie,
      wasOvertimeRequired,
      losingTeam
    );

    /////////////////////////////////
    // increase points for both teams
    /////////////////////////////////

    // home team
    const homeTeamsUpdatedStandings = incrementPointsForTeams(
      getSeasonStandings,
      homeTeamPoints,
      homeTeamsStandingIndex,
      getSeasonStandings
    );

    // away team
    const awayTeamsUpdatedStandings = incrementPointsForTeams(
      getSeasonStandings,
      awayTeamPoints,
      awayTeamsStandingIndex,
      getSeasonStandings
    );
    //////////////////////
    // update the database
    //////////////////////

    await getSeasonModel.updateOne(
      {
        _id: getSeasonData._id,
      },
      {
        $set: {
          [`standings.${homeTeamsStandingIndex}`]: homeTeamsUpdatedStandings,
          [`standings.${awayTeamsStandingIndex}`]: awayTeamsUpdatedStandings,
        },
      }
    );
    //////////////////////////////////////////////
    // all file processing complete return to user
    //////////////////////////////////////////////
    return nextResponse(
      {
        message: "File has been added to the database",
        newStandings: getSeasonStandings,
      },
      200,
      "POST"
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
