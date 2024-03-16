import { Schema, model, models } from "mongoose";
import GameResultSchema from "./game-result/gameResult";
import Home_Team_Stats from "../home-team-game-stats/homeTeamGameStats";
import Away_Team_Stats from "../away-team-game-stats/awayTeamGameStats";
import Csv_game_data from "../csv-game-stats/csvGameStats";
import { CSV_HEADERS } from "@/utils/constants/constants";

const Q_GamesSchema = new Schema({
  ...GameResultSchema.obj,
});

// statics list
// 1. getGamesOfType (filters between season/playoff games)
// 2. getGamesBySeasonNumber filters games by season number
// 3. getSingleGame
// 4. query for games from specific team
// 5. query for segment of games for ticker or scoreboard
// 6. get game stats for either home or away team
// 7. get game data in csv format

// 2. filters games by season number
Q_GamesSchema.statics.getGamesBySeasonNumber = async function (seasonNumber) {
  // get a list of games by season number
  const gamesList = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  return gamesList;
};

// 3. query for a single game
Q_GamesSchema.statics.getSingleGame = async function (gameId) {
  const game = await this.findOne({ _id: gameId });
  return game;
};

// 4. query for a teams games by game type
Q_GamesSchema.statics.getTeamsGames = async function (
  seasonNumber,
  gameType,
  teamAcronym
) {
  const getSeasonGames = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  const filteredGamesList = await getGamesOfType(getSeasonGames, gameType);
  const getTeamsGames = filteredGamesList.filter(
    (game) =>
      game.otherGameStats.homeTeam == teamAcronym ||
      game.otherGameStats.awayTeam == teamAcronym
  );
  let teamsGames = [];
  for (const game of getTeamsGames) {
    // get home team goals scored
    const homeGoals = await getHomeTeamGameStat(game, "HomeGOALS");
    // get away team goals scored
    const awayGoals = await getAwayTeamGameStat(game, "AwayGOALS");
    // add each teams goals to othergamestats to be used for score ticker or other score related components
    // have to convert the mongoose doc into a javascript object in order to add new values
    const gameObj = game.toObject();
    addFieldToGameObject(gameObj, "homeGoals", homeGoals);
    addFieldToGameObject(gameObj, "awayGoals", awayGoals);
    teamsGames.push(gameObj);
  }
  return teamsGames;
};

// 5. query for segment of games for ticker or scoreboard
Q_GamesSchema.statics.getSelectedGames = async function (
  seasonNumber,
  beginIndex,
  howManyGamesToGet
) {
  const seasonGames = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  const totalGamesSubmitted = seasonGames.length;
  const endIndex = beginIndex + howManyGamesToGet;
  const getArrayOfRequestedGames = seasonGames.slice(beginIndex, endIndex);
  const selectedGames = [];
  for (const game of getArrayOfRequestedGames) {
    // get home team goals scored
    const homeGoals = await getHomeTeamGameStat(game, "HomeGOALS");
    // get away team goals scored
    const awayGoals = await getAwayTeamGameStat(game, "AwayGOALS");
    // add each teams goals to othergamestats to be used for score ticker or other score related components
    // have to convert the mongoose doc into a javascript object in order to add new values
    const gameObj = game.toObject();
    addFieldToGameObject(gameObj, "homeGoals", homeGoals);
    addFieldToGameObject(gameObj, "awayGoals", awayGoals);
    selectedGames.push(gameObj);
  }
  return { selectedGames, totalGamesSubmitted };
};

Q_GamesSchema.statics.getFieldData = async function (
  seasonNumber,
  paramtersList,
  requestedDataObject
) {
  let gamesList = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  //////////////////////////////////
  // if recent results are required
  //////////////////////////////////
  if (paramtersList.includes("recent-results")) {
    const howManyGamesPlayed = gamesList.length;
    // array that will hold the range of games
    let recentlyPlayedGames = [];

    if (howManyGamesPlayed > 8) {
      gamesList = gamesList.slice(howManyGamesPlayed - 8);
    }

    for (const game of gamesList) {
      // get home team goals scored
      const homeGoals = await getHomeTeamGameStat(game, "HomeGOALS");
      // get away team goals scored
      const awayGoals = await getAwayTeamGameStat(game, "AwayGOALS");
      // add each teams goals to othergamestats to be used for score ticker or other score related components
      // have to convert the mongoose doc into a javascript object in order to add new values
      const gameObj = game.toObject();
      addFieldToGameObject(gameObj, "homeGoals", homeGoals);
      addFieldToGameObject(gameObj, "awayGoals", awayGoals);
      recentlyPlayedGames.push(gameObj);
    }

    requestedDataObject.recentlyPlayedGames = recentlyPlayedGames;
    requestedDataObject.totalGamesSubmitted = howManyGamesPlayed;
  }

  return requestedDataObject;
};

// 6. get home team stats
Q_GamesSchema.statics.getTeamsGameStats = async function (gameId, homeOrAway) {
  const gameObject = await this.findOne({ _id: gameId });
  let gameStatsDoc;
  if (homeOrAway === "home") {
    gameStatsDoc = await Home_Team_Stats.find({
      _id: gameObject.homeTeamGameStats,
    });
  }
  if (homeOrAway === "away") {
    gameStatsDoc = await Away_Team_Stats.find({
      _id: gameObject.awayTeamGameStats,
    });
  }
  return gameStatsDoc;
};

// 7. get csv data of games
Q_GamesSchema.statics.getCsvGameData = async function (seasonNumber, gameReturnCount = 10) {
  // default games returned is set to 10
  const games = await this.find({ "otherGameStats.seasonNumber":seasonNumber, "csvFormattedGameData": { $exists: true } });
  const gamesLength = games.length;
  const listOfCsvGameData = [];
  for (let i = 0; i < gamesLength; i++) {
    const gameDataInCsvFormat = await Csv_game_data.find({_id: games[i].csvFormattedGameData});
    listOfCsvGameData.push(gameDataInCsvFormat[0].csvFormatGameStats);
  }

  // begin constructing csv string that will be returned
  let gameDataInStringFormat = CSV_HEADERS + "\r\n";

// trim the array to how many games need to be returned
if(gameReturnCount === "all"){
  listOfCsvGameData.forEach(gameString => {
    gameDataInStringFormat += gameString
    gameDataInStringFormat += "\r\n"
  })
  return gameDataInStringFormat
} else if(!/^\d{1,2}$/.test(gameReturnCount.toString())){
  const arrayToBuildCsvStringWith = listOfCsvGameData.slice(-10);
  arrayToBuildCsvStringWith.forEach(gameString => {
    gameDataInStringFormat += gameString
    gameDataInStringFormat += "\r\n"
  })
  return gameDataInStringFormat
} else {
  let gamesToBeReturned = +gameReturnCount
  const arrayToBuildCsvStringWith = listOfCsvGameData.slice(-gamesToBeReturned);
  arrayToBuildCsvStringWith.forEach(gameString => {
    gameDataInStringFormat += gameString
    gameDataInStringFormat += "\r\n"
  })
  return gameDataInStringFormat
}
}

// end statics

///////////////////
// helper functions
///////////////////

//  1. gets either season or playoff games
async function getGamesOfType(gamesArray, gameType) {
  // get a list of games by season number
  const gamesList = gamesArray.filter(
    (game) => game.otherGameStats.gameType === gameType
  );
  return gamesList;
}

// 2. appends game data to a returned game object that has previously been fetched using mongo ref
function addFieldToGameObject(game, fieldToAdd, fieldSource) {
  const updatedGameObject = (game.otherGameStats[fieldToAdd] = fieldSource);
  return updatedGameObject;
}

// 3. get home team game stat
async function getHomeTeamGameStat(game, statToGet) {
  // get related document in for home teams game stats
  const getHomeTeamsGameStatsDoc = await Home_Team_Stats.find({
    _id: game.homeTeamGameStats,
  });
  // get the requested game stat
  const stat = getHomeTeamsGameStatsDoc[0]["gameStats"][statToGet];
  return stat;
}

// 4. get away team game stat
async function getAwayTeamGameStat(game, statToGet) {
  // get related document in for home teams game stats
  const getAwayTeamsGameStatsDoc = await Away_Team_Stats.find({
    _id: game.awayTeamGameStats,
  });
  // get the requested game stat
  const stat = getAwayTeamsGameStatsDoc[0]["gameStats"][statToGet];
  return stat;
}

////////////////////////
// end helper functions
////////////////////////

const Q_Game = models.q_game || model("q_game", Q_GamesSchema);

export default Q_Game;
