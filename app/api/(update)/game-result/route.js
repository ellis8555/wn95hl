import { connectToDb } from "@/utils/database";
import getTeamsStandingsIndex from "@/utils/api/table-methods/team-standings/get-teams-standings-index";
import incrementGamesPlayed from "@/utils/api/table-methods/team-standings/increment-games-played";
import incrementWinningTeamsWins from "@/utils/api/table-methods/team-standings/increment-winning-teams-wins";
import incrementLosingTeamsLosses from "@/utils/api/table-methods/team-standings/increment-losing-teams-losses";
import incrementTiesForTieGame from "@/utils/api/table-methods/team-standings/increment-ties-for-tie-game";
import incrementOvertimeLoss from "@/utils/api/table-methods/team-standings/increment-overtime-loss";
import incrementPointsForTeams from "@/utils/api/table-methods/team-standings/increment-points-for-teams";
import incrementGoalsFor from "@/utils/api/table-methods/team-standings/increment-goals-for";
import incrementGoalsAgainst from "@/utils/api/table-methods/team-standings/increment-goals-against";
import setTeamsGoalsDiff from "@/utils/api/table-methods/team-standings/set-teams-goals-diff";
import setCurrentTeamStreak from "@/utils/api/table-methods/team-standings/set-current-team-streak";
import nextResponse from "@/utils/api/next-response";
import {
  LEAGUE_SCHEMA_SWITCH,
  LEAGUE_GAMES_SCHEMA_SWITCH,
} from "@/utils/constants/data-calls/db_calls";
import { WRITE_TO_DB, ALLOW_DUPLICATES } from "@/utils/constants/connections";
import { PURE_LEAGUE_STATE_PATTERN, STATE_PATTERN, MOST_RECENT_P_SEASON, P_LEAGUE_GAME_TYPE } from "@/utils/constants/constants";
import Club from "@/schemas/club";
import Scoring from "@/schemas/scoring-summary/allGoalsScored";
import Penalty from "@/schemas/penalty-summary/allPenalties";
import Away_Team_Stats from "@/schemas/away-team-game-stats/awayTeamGameStats";
import Home_Team_Stats from "@/schemas/home-team-game-stats/homeTeamGameStats";
import Home_Team_Goalie_Stats from "@/schemas/home-team-goalie-stats/homeTeamGoalieStats";
import Away_Team_Goalie_Stats from "@/schemas/away-team-goalie-stats/awayTeamGoalieStats";
import Home_Team_Player_Stats from "@/schemas/home-team-player-stats/homeTeamPlayerStats";
import Away_Team_Player_Stats from "@/schemas/away-team-player-stats/awayTeamPlayerStats";
import Csv_game_data from "@/schemas/csv-game-stats/csvGameStats";
import updatePointsPercentage from "@/utils/api/table-methods/team-standings/update-points-percentage";
import updateTeamsLastTen from "@/utils/api/table-methods/team-standings/update-teams-last-ten";
import updateTeamsShutouts from "@/utils/api/table-methods/team-standings/update-teams-shutouts";
import updateGoalsAgainstAverage from "@/utils/api/table-methods/team-standings/update-goals-against-average";
import updateGoalsForAverage from "@/utils/api/table-methods/update-goals-for-average";

const dbCallFrom = "api update game-result";
// OPTIONS is needed for a post request from an outside projects request
export const OPTIONS = async (req, res) => {
  return nextResponse({}, 200, "OPTIONS");
};
// the acutal POST request
export const POST = async (req, res) => {
  //FIXME: tempCSVData to be removed in future. it is data used to append to csv file
  // tempCSVData comes from python script headerArray object
  const { currSeason, fileName, fileSize, data, tempCSVData = undefined } = await req.json();
  let currentLeague;
  let currentSeason;

  // get the game type used for updating relevant stats
  // ex. 'season' type updates the standings where 'playoff' does not
  let gameType = data.otherGameStats.gameType;
 // if checks that are not of csv file type
// is gamestate from pure league
  if(PURE_LEAGUE_STATE_PATTERN.test(fileName)){
    currentLeague = "p";
    currentSeason = MOST_RECENT_P_SEASON;
    // is gamestate from q, v, or w leagues 
  } else if(STATE_PATTERN.test(fileName)) {
        // extract leagueName from gamestate file name
        currentLeague = fileName[0].toLowerCase();
        // extract season number from game state file name
        // drop the 0 if season begins with zero ex '02'
        if (fileName[2] === "0") {
          currentSeason = fileName[3];
        } else {
          currentSeason = fileName[2] + fileName[3];
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
    (fileName === "WN95HL_Game_Stats.csv" && fileSize > 1_400_000) ||
    (fileName.includes("state") && fileSize > 1_400_000)
  ) {
    return nextResponse(
      {
        message:
          "File was not uploaded. Either filename not allowed or filesize is to large",
      },
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
    await connectToDb(dbCallFrom);
    // get the leagues document for the correct season
    let League;
    let seasonDocument;
    let LeagueGames;

    switch (currentLeague) {
      case "w":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      case "W":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      case "q":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      case "Q":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      case "V":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      case "v":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      case "P":
        League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        if(seasonDocument.hasSeasonBegun && !seasonDocument.hasSeasonEnded){
          gameType = "season"
        }
        if(seasonDocument.hasPlayoffsBegun && !seasonDocument.hasPlayoffsEnded){
          gameType = "playoff"
        }
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
        case "p":
          League = await LEAGUE_SCHEMA_SWITCH(currentLeague);
          seasonDocument = await League.findOne({
            seasonNumber: currentSeason,
          });
          if(seasonDocument.hasSeasonBegun && !seasonDocument.hasSeasonEnded){
            gameType = "season"
          }
          if(seasonDocument.hasPlayoffsBegun && !seasonDocument.hasPlayoffsEnded){
            gameType = "playoff"
          }
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH(currentLeague);
        break;
      default:
        League = await LEAGUE_SCHEMA_SWITCH("w");
        seasonDocument = await League.findOne({
          seasonNumber: currentSeason,
        });
        LeagueGames = await LEAGUE_GAMES_SCHEMA_SWITCH("w");
    }

    // if season does not exist exit
    if (!seasonDocument) {
      return nextResponse(
        {
          message: `The ${currentLeague} has no season ${currentSeason} registered`,
        },
        400,
        "POST"
      );
    }
    // check if season has been officially begun as per commisioner setting 'hasSeasonBegun = true'
    if(gameType === "season"){
      if (!seasonDocument.hasSeasonBegun) {
        return nextResponse(
          {
            message: `The ${currentLeague} season ${currentSeason} has not officially begun yet`,
          },
          400,
          "POST"
        );
      }
      // if season has ended per commisioner setting 'hasSeasonEnded = true
      if (seasonDocument.hasSeasonEnded) {
        return nextResponse(
          {
            message: `The ${currentLeague} season ${currentSeason} has officially ended`,
          },
          400,
          "POST"
        );
      }
      //check if playoffs have been officially ended as per commisioner setting 'hasPlayoffsBegun = true'
    } else if(gameType === "playoff"){
      if (!seasonDocument.hasPlayoffsBegun) {
        return nextResponse(
          {
            message: `Playoffs for ${currentLeague} season ${currentSeason} have not officially begun yet`,
          },
          400,
          "POST"
        );
      }
      if (seasonDocument.hasPlayoffsEnded) {
        return nextResponse(
          {
            message: `Playoffs for ${currentLeague} season ${currentSeason} have officially ended`,
          },
          400,
          "POST"
        );
      }
    } else {
      return nextResponse(
        {
          message: `Game type must either be of type season or playoff`,
        },
        400,
        "POST"
      );
    }

    ///////////////////////////////
    // get the data for this season
    ///////////////////////////////
    const getSeasonData = seasonDocument;
    const getSeasonGames = await LeagueGames.getGamesBySeasonNumber(
      +currentSeason,
      "season"
    );
    const getSeasonStandings = getSeasonData.standings;
    const otherStats = data.otherGameStats;
    const getRegisteredTeams = getSeasonData.teams.map((team) => {
      return team.teamAcronym;
    });

    ///////////////////////////////////////////////////
    // check that file has not previously been uploaded
    ///////////////////////////////////////////////////
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

// checks if duplicates are enabled for testing mode
if(!ALLOW_DUPLICATES){
  if (isDuplicate) {
    return nextResponse(
      {
        message: `This game appears to be a duplicate. Game data was not saved..`,
      },
      400,
      "POST"
    );
  }
}

    ////////////////////////////////////////////
    // check teams submitted are in this league
    ////////////////////////////////////////////

    const homeTeamAbbr = otherStats.homeTeam;
    const homeTeamName = await Club.queryClubDetail(
      "teamAcronym",
      homeTeamAbbr,
      "name"
    );
    const awayTeamAbbr = otherStats.awayTeam;
    const awayTeamName = await Club.queryClubDetail(
      "teamAcronym",
      awayTeamAbbr,
      "name"
    );

    const checkHomeTeamIsRegistered = getRegisteredTeams.includes(homeTeamAbbr);
    const checkAwayTeamIsRegistered = getRegisteredTeams.includes(awayTeamAbbr);
    let notRegisteredMessage;
    if (getRegisteredTeams.length === 0) {
      notRegisteredMessage =
        "Neither teams are registered for this league. Game was not submitted";
    } else if (!checkHomeTeamIsRegistered) {
      notRegisteredMessage = `${homeTeamName} is not registered in this league. Game was not sumbitted`;
    } else if (!checkAwayTeamIsRegistered) {
      notRegisteredMessage = `${awayTeamName} is not registered in this league. Game was not submitted`;
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
///////////////////////////////////////////////////////////
// begin updating relevant stats for game type of 'season'
///////////////////////////////////////////////////////////
if(gameType === 'season'){
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
    const getAwayTeamsAwaySchedule = getAwayTeamsSeasonObject.schedule.away;

    const extractHomeOpponent = +getHomeTeamsHomeSchedule.indexOf(awayTeamAbbr);
    const extractAwayOpponent = +getAwayTeamsAwaySchedule.indexOf(homeTeamAbbr);

// if duplicates allowed for testing then by pass checking teams schedule
if(!ALLOW_DUPLICATES){
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
  getAwayTeamsAwaySchedule.splice(extractAwayOpponent, 1);

  // rewrite teams home/away schedules to reflect recent game played and submitted

  seasonDocument.teams[homeTeamsObjectIndex].schedule.home =
    getHomeTeamsHomeSchedule;
  seasonDocument.teams[awayTeamsObjectIndex].schedule.away =
    getAwayTeamsAwaySchedule;
}

    ///////////////////////////////////////////////////////////////
    // all checks passed and game file seems ready for submission
    ///////////////////////////////////////////////////////////////

    ////////////////////////////
    // set timestamp for upload
    ////////////////////////////
    otherStats.submittedAt = new Date()

    // check if season Start date has been set in the db
    // first game entry is the starting point for a season
    if (getSeasonData.startDate == null) {
      seasonDocument.startDate = Date.now();
    }

    // check if season end date needs to be set

    const getCurrentTotalGamesPlayed = getSeasonGames.length;

    const getTotalGamesToBePlayed = +getSeasonData.totalGamesToBePlayed;

    // subtract one as this game state has yet to be added so the count will be less one at this point
    if (getCurrentTotalGamesPlayed === getTotalGamesToBePlayed - 1) {
      seasonDocument.endDate = Date.now();
      seasonDocument.hasSeasonEnded = true;
    }

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
      winningTeam = await Club.queryClubDetail(
        "teamAcronym",
        otherStats.winningTeam,
        "name"
      );
      losingTeam = await Club.queryClubDetail(
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
    // increase goals for both teams
    /////////////////////////////////

// increment home teams goals for
incrementGoalsFor(getSeasonStandings, homeTeamsStandingIndex, getSeasonStandings[homeTeamsStandingIndex].Gf, data.homeTeamGameStats['HomeGOALS'])
// increment away teams goals for
incrementGoalsFor(getSeasonStandings, awayTeamsStandingIndex, getSeasonStandings[awayTeamsStandingIndex].Gf, data.awayTeamGameStats['AwayGOALS'])

    ////////////////////////////////////
    // increase goals against both teams
    ////////////////////////////////////

    // increment home teams goals against
incrementGoalsAgainst(getSeasonStandings, homeTeamsStandingIndex, getSeasonStandings[homeTeamsStandingIndex].Ga, data.awayTeamGameStats['AwayGOALS'])
// increment away teams goals against
incrementGoalsAgainst(getSeasonStandings, awayTeamsStandingIndex, getSeasonStandings[awayTeamsStandingIndex].Ga, data.homeTeamGameStats['HomeGOALS'])

    ////////////////////////////////////
    // set goal diff for both teams
    ////////////////////////////////////

      // set home teams goal diff
      setTeamsGoalsDiff(getSeasonStandings, homeTeamsStandingIndex)
      
      // set away teams goal diff
      setTeamsGoalsDiff(getSeasonStandings, awayTeamsStandingIndex)

    ///////////////////////////
    // adjust goals for average
    ///////////////////////////

    // update home teams goals for
    updateGoalsForAverage(getSeasonStandings, homeTeamsStandingIndex)

    //update away teams goals for
    updateGoalsForAverage(getSeasonStandings, awayTeamsStandingIndex)
    
    ///////////////////////////////
    // adjust goals against average
    ///////////////////////////////
    
    // update home teams goals against
updateGoalsAgainstAverage(getSeasonStandings, homeTeamsStandingIndex,)

    // update away teams goals against
updateGoalsAgainstAverage(getSeasonStandings, awayTeamsStandingIndex,)


    //////////////////////////////
    // adjust teams current streak
    //////////////////////////////

    // set home teams streak
setCurrentTeamStreak(getSeasonStandings, homeTeamsStandingIndex, homeTeamPoints, wasGameATie)
// set away teams streak
setCurrentTeamStreak(getSeasonStandings, awayTeamsStandingIndex, awayTeamPoints, wasGameATie)

    ////////////////////////
    // adjust teams last ten
    ////////////////////////

    // set home teams last ten games
    updateTeamsLastTen(getSeasonStandings, wasGameATie, homeTeamsStandingIndex, homeTeamPoints)
    // set away teams last ten games
    updateTeamsLastTen(getSeasonStandings, wasGameATie, awayTeamsStandingIndex, awayTeamPoints)

    /////////////////////////
    // adjust teams shut outs
    /////////////////////////

    // adjust home teams shutouts
    if(data.awayTeamGameStats.AwayGOALS == 0){
      updateTeamsShutouts(getSeasonStandings, homeTeamsStandingIndex)
    }

    // adjust away teams shutouts
    if(data.homeTeamGameStats.HomeGOALS == 0){
      updateTeamsShutouts(getSeasonStandings, awayTeamsStandingIndex)
    }

    /////////////////////////////////
    // increase points for both teams
    /////////////////////////////////

    // home team
    incrementPointsForTeams(
      getSeasonStandings,
      homeTeamPoints,
      homeTeamsStandingIndex,
      getSeasonStandings
    );

    // away team
incrementPointsForTeams(
      getSeasonStandings,
      awayTeamPoints,
      awayTeamsStandingIndex,
      getSeasonStandings
    );

        ///////////////////////
    // adjust points percentage
    ///////////////////////////

    // home team
    const homeTeamsUpdatedStandings = updatePointsPercentage(getSeasonStandings, homeTeamsStandingIndex);

    // away team
    const awayTeamsUpdatedStandings = updatePointsPercentage(getSeasonStandings, awayTeamsStandingIndex);

    /////////////////////////////////
    // set standings object
    /////////////////////////////////

    seasonDocument.standings[homeTeamsStandingIndex] =
      homeTeamsUpdatedStandings;
    seasonDocument.standings[awayTeamsStandingIndex] =
      awayTeamsUpdatedStandings;
}

    ///////////////////////////////////////////
    // end of updates if game of type 'season'
    ///////////////////////////////////////////

    /////////////////////////////////////////////////
    // update the databases if WRITE_TO_DB is enabled
    /////////////////////////////////////////////////
if(WRITE_TO_DB){

    /////////////////////////
    // goal scoring summaries
    /////////////////////////

    // add goal summary to scoring collection
    const scoringSummary = await new Scoring({
      goals: data.allGoalsScored,
    }).save();
    // get goal summaries object id and edit data objects scoring reference to this id
    const scoringSummaryId = scoringSummary._id;
    data.allGoalsScored = scoringSummaryId;

    ////////////////////
    // penalty summaries
    ////////////////////

    // add penalty summary to penalties collection
    const penaltySummary = await new Penalty({
      penalty: data.allPenalties,
    }).save();
    // get penalty summaries object id and edit data objects penalty reference to this id
    const penaltySummaryId = penaltySummary._id;
    data.allPenalties = penaltySummaryId;

    //////////////////////
    // team stat summaries
    //////////////////////

    // add away team game stats to away team stats collection
    const awayTeamGameStatsSummary = await new Away_Team_Stats({
      gameStats: data.awayTeamGameStats,
    }).save();
    // get away team stats summaries object id and edit data objects away team stats reference to this id
    const awayTeamGameStatsID = awayTeamGameStatsSummary._id;
    data.awayTeamGameStats = awayTeamGameStatsID;

    // add home team game stats to home team stats collection
    const homeTeamGameStatsSummary = await new Home_Team_Stats({
      gameStats: data.homeTeamGameStats,
    }).save();
    // get away team stats summaries object id and edit data objects away team stats reference to this id
    const homeTeamGameStatsID = homeTeamGameStatsSummary._id;
    data.homeTeamGameStats = homeTeamGameStatsID;

    ////////////////////////
    // goalie stat summaries
    ////////////////////////

    // get home team goalie stats summaries object id and edit data objects home team goalie stats reference to this id
    const homeTeamGoalieStatsSummary = await new Home_Team_Goalie_Stats({
      goalieStats: data.homeTeamGoalieStats,
    }).save();
    const homeTeamGoalieStatsID = homeTeamGoalieStatsSummary._id;
    data.homeTeamGoalieStats = homeTeamGoalieStatsID;

    // get away team goalie stats summaries object id and edit data objects away team goalie stats reference to this id
    const awayTeamGoalieStatsSummary = await new Away_Team_Goalie_Stats({
      goalieStats: data.awayTeamGoalieStats,
    }).save();
    const awayTeamGoalieStatsID = awayTeamGoalieStatsSummary._id;
    data.awayTeamGoalieStats = awayTeamGoalieStatsID;

    ////////////////////////
    // player stat summaries
    ////////////////////////

    // get home team player stats summaries object id and edit data objects home team player stats reference to this id
    const homeTeamPlayerStatsSummary = await new Home_Team_Player_Stats({
      playerStats: data.homeTeamPlayerStats,
    }).save();
    const homeTeamPlayerStatsID = homeTeamPlayerStatsSummary._id;
    data.homeTeamPlayerStats = homeTeamPlayerStatsID;

    // get away team player stats summaries object id and edit data objects away team player stats reference to this id
    const awayTeamPlayerStatsSummary = await new Away_Team_Player_Stats({
      playerStats: data.awayTeamPlayerStats,
    }).save();
    const awayTeamPlayerStatsID = awayTeamPlayerStatsSummary._id;
    data.awayTeamPlayerStats = awayTeamPlayerStatsID;
  }
    ///////////////////////////////////////////////////////////////////////
//FIXME: the following needs to be rewritten to connect to github api
// to be removed in the future if not needed for google sheets
// creates a comma seperated string of game data
// created in use for original google sheets stats
///////////////////////////////////////////////////////////////////////
// tempCSVData is headerArray from python script. sample [["homeTeam", "AHC"],[...]]
// tempCSVData will be undefined if the game submission is from a .csv file
// check if game is submitted via a gamestate as this builds the csv string differently
let gameDataString = "";
if(tempCSVData != undefined || tempCSVData != null){
    tempCSVData.forEach(stat => {
      // grab the value from the array of arrays
      gameDataString +=  `,${stat[1]}`
    })
    gameDataString = gameDataString.slice(1);
  }
// check if game data is submitted via csv file
if(data.csvFormattedGameData){
  gameDataString = data.csvFormattedGameData
}

  // add csv formatted string of gamestats to the database
  if(WRITE_TO_DB){
    const csvGameData = await new Csv_game_data({
      csvFormatGameStats: gameDataString,
    }).save();
    const csvGameDataID = csvGameData._id;
    data.csvFormattedGameData = csvGameDataID;
  }

    ////////////////////////
    // end updating sub docs
    ////////////////////////

    ////////////////////////////
    // update master collections
    ////////////////////////////

    // update seasons collection
    if(WRITE_TO_DB){
      await seasonDocument.save();
  
      // add game to games collection
      await new LeagueGames(data).save();
    }

    ////////////////////////////////////////////
    //all file processing complete return to user
    ////////////////////////////////////////////
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
  }
};
