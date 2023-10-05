import { Schema } from "mongoose";
import LeagueTableSchema from "./leagueTable";
import LeaguesTeamsSchema from "./leagueTeamsSchema";
import GameResultSchema from "@/schemas/game-result/gameResult";

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
  teams: [LeaguesTeamsSchema],
  teamsDictCodes: {
    type: Object,
    default: {},
  },
  standings: [LeagueTableSchema],
  seasonGames: [GameResultSchema],
  divisionalGames: {
    type: String,
    default: "",
  },
  conferenceGames: {
    type: String,
    default: "",
  },
  otherConferenceGames: {
    type: String,
    default: "",
  },
  totalGamesToBePlayed: {
    type: String,
    default: "0",
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

export default SeasonSchema;
