import { Schema, models, model } from "mongoose";
import LeagueTableSchema from "../standings/league-table";
import GameResult from "../gameResults/gameResult";

const SeasonScehma = new Schema({
  teams: [String],
  standings: [LeagueTableSchema],
  seasonGames: [GameResult],
});

// method that will create a dynamic schema
function getSeasonsModel(seasonNumber) {
  const modelName = `season${seasonNumber}detail`;

  if (models[modelName]) {
    return models[modelName];
  }

  return model(modelName, SeasonScehma);
}

export default getSeasonsModel;
