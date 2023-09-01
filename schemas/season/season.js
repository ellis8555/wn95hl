import { Schema, models, model } from "mongoose";
import LeagueTableSchema from "../standings/league-table";
import LeaugesTeamsSchema from "./seasonSubSchemas/leagueTeamsSchema";
import GameResult from "../gameResults/gameResult";

const SeasonSchema = new Schema({
  seasonNumber: String,
  hasSeasonBegun: {
    type: Boolean,
    default: false,
  },
  hasSeasonEnded: {
    type: Boolean,
    default: false,
  },
  conferences: [String],
  divisions: [String],
  teams: [LeaugesTeamsSchema],
  standings: [LeagueTableSchema],
  seasonGames: [GameResult],
  divisionalGames: {
    type: String,
    default: "",
  },
  conferenceGames: {
    type: String,
    default: "",
  },
  remainingGames: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
});

// method that will create a dynamic schema
function getSeasonsModel(leagueName) {
  const modelName = `${leagueName}_seasons`;
  if (models[modelName]) {
    return models[modelName];
  }

  return model(modelName, SeasonSchema);
}

export default getSeasonsModel;
