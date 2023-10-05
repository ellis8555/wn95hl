import { Schema } from "mongoose";

const LeagueTableSchema = new Schema({
  teamName: String,
  teamAcronym: String,
  GP: {
    type: Number,
    default: 0,
  },
  W: {
    type: Number,
    default: 0,
  },
  L: {
    type: Number,
    default: 0,
  },
  T: {
    type: Number,
    default: 0,
  },
  OTL: {
    type: Number,
    default: 0,
  },
  Pts: {
    type: Number,
    default: 0,
  },
});

export default LeagueTableSchema;
