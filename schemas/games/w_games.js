import { Schema, model, models } from "mongoose";
import GameResultSchema from "../game-result/gameResult";

const leagueName = "W";

const W_GamesSchema = new Schema({
  ...GameResultSchema.obj,
});

// statics list
// 1. getGamesOfType (filters between season/playoff games)
// 2 getGamesBySeasonNumber filters games by season number

//  1. gets either season or playoff games
async function getGamesOfType(gamesArray, gameType) {
  // get a list of games by season number
  const gamesList = gamesArray.filter(
    (game) => game.otherGameStats.gameType === gameType
  );
  return gamesList;
}

// 2. filters games by season number
W_GamesSchema.statics.getGamesBySeasonNumber = async function (
  seasonNumber,
  gameType
) {
  // get a list of games by season number
  const gamesList = await this.find({
    "otherGameStats.seasonNumber": seasonNumber,
  });
  const filteredGamesList = await getGamesOfType(gamesList, gameType);
  return filteredGamesList;
};

// end statics

const W_Game = models.w_game || model("w_game", W_GamesSchema);

export default W_Game;
