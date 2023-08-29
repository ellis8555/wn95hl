import { Schema, models, model } from "mongoose";
import LeagueTableSchema from "../standings/league-table";
import LeaugesTeamsSchema from "./seasonSubSchemas/leagueTeamsSchema";
import GameResult from "../gameResults/gameResult";

const SeasonSchema = new Schema({
  seasonNumber: String,
  isSeasonComplete: {
    type: Boolean,
    default: false,
  },
  teams: [LeaugesTeamsSchema],
  standings: [LeagueTableSchema],
  seasonGames: [GameResult],
  startDate: Date,
  endDate: Date,
});

// method that will create a dynamic schema
function getSeasonsModel(leagueName) {
  const modelName = `The_${leagueName}`;

  if (models[modelName]) {
    return models[modelName];
  }

  return model(modelName, SeasonSchema);
}

export default getSeasonsModel;
