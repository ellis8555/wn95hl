import { Schema } from "mongoose";

const LeaguesTeamsSchema = new Schema({
  teamAcronym: String,
  logo: String,
  conference: String,
  division: String,
  managers: {
    type: [String],
    required: true
  },
  schedule: {
    home: {
      type: [String],
      default: [],
    },
    away: {
      type: [String],
      default: [],
    },
  },
});

export default LeaguesTeamsSchema;
