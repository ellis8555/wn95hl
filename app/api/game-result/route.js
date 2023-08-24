import { connectToDb } from "@/utils/database";
import queryForIfSeasonExists from "@/utils/db-queries/query-one/club/query-if-season-exists";
import queryForASeason from "@/utils/db-queries/query-one/season/query-for-a-season";
import queryClubDetatail from "@/utils/db-queries/query-one/club/query-club-detail";
import getTeamsStandingsIndex from "@/utils/tables/team-standings/get-teams-standings-index";
import incrementGamesPlayed from "@/utils/tables/team-standings/increment-games-played";
import incrementWinningTeamsWins from "@/utils/tables/team-standings/increment-winning-teams-wins";
import incrementLosingTeamsLosses from "@/utils/tables/team-standings/increment-losing-teams-losses";
import incrementTiesForTieGame from "@/utils/tables/team-standings/increment-ties-for-tie-game";
import incrementOvertimeLoss from "@/utils/tables/team-standings/increment-overtime-loss";
import incrementPointsForTeams from "@/utils/tables/team-standings/increment-points-for-teams";
import nextResponse from "@/utils/api/next-response";

let db;

export const POST = async (req, res) => {
  const { fileName, fileSize, fileType, data, currentSeason } =
    await req.json();

  // reject files that do match a set name
  // reject uploads that are to large
  // reject files that are not .csv filetype

  if (
    !(fileName === "WN95HL_Game_Stats.csv" || fileName.includes("state")) ||
    fileSize > 1036400
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
    const thisSeasonsCollection = await queryForIfSeasonExists(8);

    if (!thisSeasonsCollection) {
      return nextResponse(
        {
          message: `There is no season ${currentSeason} registered`,
        },
        400,
        "POST"
      );
    }

    // get reference to current seasons collection

    const getSeasonCollection = await queryForASeason(thisSeasonsCollection);

    ///////////////////////////////
    // get the data for this season
    ///////////////////////////////

    const getSeasonData = await getSeasonCollection.findOne({});
    const getSeasonGames = getSeasonData.seasonGames;
    const getSeasonStandings = getSeasonData.standings;
    const getRegisteredTeams = getSeasonData.teams;

    // check that file has not previously been uploaded
    let isDuplicate = false;
    const getUniqueGameId = data.otherGameStats["uniqueGameId"];

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
    //   return NextResponse.json(
    //     {
    //       message:
    //         "This game appears to be a duplicate. Game data was not saved..",
    //     },
    //     {
    //       status: 400,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    ////////////////////////// END OF TEMP DISABLED ////////////////////////////////////////////////

    ////////////////////////////////////////////
    // check teams submitted are in this league
    ////////////////////////////////////////////

    const otherStats = data.otherGameStats;
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

    const checkHomeTeamIsRegistered = getRegisteredTeams.includes(homeTeamName);
    const checkAwayTeamIsRegistered = getRegisteredTeams.includes(awayTeamName);

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

    ///////////////////////////////////////////////////////////////
    // all checks passed and game file seems ready for submission
    ///////////////////////////////////////////////////////////////

    // add the game file to season games array of game results to the database
    getSeasonGames.push(data);

    await getSeasonCollection.updateOne(
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

    // reference to array that contains each teams standings object
    const getSeasonsTableObjects = getSeasonData.standings;

    //////////////////////////////////////////////
    // assign index numbers to home and away teams
    // returns index number of home team
    //////////////////////////////////////////////

    const homeTeamsStandingIndex = getTeamsStandingsIndex(
      getSeasonsTableObjects,
      homeTeamName
    );

    ////////////////////////////////////
    // returns index number of away team
    ////////////////////////////////////

    const awayTeamsStandingIndex = getTeamsStandingsIndex(
      getSeasonsTableObjects,
      awayTeamName
    );

    ///////////////////////////////////////////
    // increase both teams games played by one
    ///////////////////////////////////////////

    incrementGamesPlayed(
      getSeasonsTableObjects,
      homeTeamsStandingIndex,
      awayTeamsStandingIndex
    );

    ///////////////////////////////////////////////////
    // increase wins for winning team if game not tied
    ///////////////////////////////////////////////////

    incrementWinningTeamsWins(getSeasonsTableObjects, wasGameATie, winningTeam);

    ///////////////////////////////////////////////////////////////////////
    // increase losses for losing team if game not tied or went to overtime
    ///////////////////////////////////////////////////////////////////////

    incrementLosingTeamsLosses(
      getSeasonsTableObjects,
      wasGameATie,
      wasOvertimeRequired,
      losingTeam
    );

    /////////////////////////////////////////////////
    // increase tie field for both teams if game tied
    /////////////////////////////////////////////////

    incrementTiesForTieGame(
      getSeasonsTableObjects,
      wasGameATie,
      homeTeamsStandingIndex,
      awayTeamsStandingIndex
    );

    ///////////////////////////////////////
    // otl for team that loses in overtime
    ///////////////////////////////////////

    incrementOvertimeLoss(
      getSeasonsTableObjects,
      wasGameATie,
      wasOvertimeRequired,
      losingTeam
    );

    /////////////////////////////////
    // increase points for both teams
    /////////////////////////////////

    // home team
    const homeTeamsUpdatedStandings = incrementPointsForTeams(
      getSeasonsTableObjects,
      homeTeamPoints,
      homeTeamsStandingIndex,
      getSeasonStandings
    );

    // away team
    const awayTeamsUpdatedStandings = incrementPointsForTeams(
      getSeasonsTableObjects,
      awayTeamPoints,
      awayTeamsStandingIndex,
      getSeasonStandings
    );
    //////////////////////
    // update the database
    //////////////////////

    await getSeasonCollection.updateOne(
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
