import { Schema } from "mongoose";
import LeagueTableSchema from "./leagueTable";
import LeaguesTeamsSchema from "./leagueTeamsSchema";
import LeaguesConferencesSchema from "./conferences";

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
  conferences: [LeaguesConferencesSchema],
  divisions: [String],
  teams: [LeaguesTeamsSchema],
  teamsDictCodes: {
    type: Object,
    default: {},
  },
  standings: [LeagueTableSchema],
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
