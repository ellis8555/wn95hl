import { Schema } from "mongoose";

const LeagueTableSchema = new Schema({
  teamName: String,
  teamAcronym: String,
  teamLogo: String,
  teamBanner: String,
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
  Gf: {
    type: Number,
    default: 0
  },
  Ga: {
    type: Number,
    default: 0
  },
  Diff: {
    type: Number,
    default: 0
  },
  Strk: {
    type: String,
    default: "-"
  }
});

export default LeagueTableSchema;
