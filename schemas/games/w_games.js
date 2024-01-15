import { Schema, model, models } from "mongoose";
import GameResultSchema from "./game-result/gameResult";

const leagueName = "W";

const W_GamesSchema = new Schema({
  ...GameResultSchema.obj,
});

// statics list
// 1. getGamesOfType (filters between season/playoff games)
// 2. getGamesBySeasonNumber filters games by season number
// 3. getSingleGame
// 4. query for games from specific team
// 5. query for segment of games for ticker or scoreboard

//  1. gets either season or playoff games
async function getGamesOfType(gamesArray, gameType) {
  // get a list of games by season number
  const gamesList = gamesArray.filter(
    (game) => game.otherGameStats.gameType === gameType
  );
  return gamesList;
}

// 2. filters games by season number
W_GamesSchema.statics.getGamesBySeasonNumber = async function (seasonNumber) {
  // get a list of games by season number
  const gamesList = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  return gamesList;
};

// 3. query for a single game
W_GamesSchema.statics.getSingleGame = async function (gameId) {
  const game = await this.findOne({ _id: gameId });
  return game;
};

// 4. query for a teams games by game type
W_GamesSchema.statics.getTeamsGames = async function (
  seasonNumber,
  gameType,
  teamAcronym
) {
  const getSeasonGames = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  const filteredGamesList = await getGamesOfType(getSeasonGames, gameType);
  const teamsGames = filteredGamesList.filter(
    (game) =>
      game.otherGameStats.homeTeam == teamAcronym ||
      game.otherGameStats.awayTeam == teamAcronym
  );
  return teamsGames;
};

// 5. query for segment of games for ticker or scoreboard
W_GamesSchema.statics.getSelectedGames = async function (
  seasonNumber,
  beginIndex,
  howManyGamesToGet
) {
  const seasonGames = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  const totalGamesSubmitted = seasonGames.length;
  const endIndex = beginIndex + howManyGamesToGet;
  const selectedGames = seasonGames.slice(beginIndex, endIndex);
  return { selectedGames, totalGamesSubmitted };
};

W_GamesSchema.statics.getFieldData = async function (
  seasonNumber,
  paramtersList,
  requestedDataObject
) {
  const gamesList = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  //////////////////////////////////
  // if recent results are required
  //////////////////////////////////
  if (paramtersList.includes("recent-results")) {
    const howManyGamesPlayed = gamesList.length;

    let recentlyPlayedGames = [];
    if (howManyGamesPlayed < 8) {
      gamesList.forEach((game) => recentlyPlayedGames.push(game));
    } else {
      recentlyPlayedGames = gamesList.slice(howManyGamesPlayed - 8);
    }

    requestedDataObject.recentlyPlayedGames = recentlyPlayedGames;
    requestedDataObject.totalGamesSubmitted = howManyGamesPlayed;
  }

  return requestedDataObject;
};

// end statics

const W_Game = models.w_game || model("w_game", W_GamesSchema);

export default W_Game;
