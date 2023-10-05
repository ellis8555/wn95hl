import { Schema } from "mongoose";

const GoalieGameStatsSchema = new Schema({
  A: String,
  G: String,
  GA: String,
  L: String,
  Name: String,
  OTL: String,
  PTS: String,
  PTS: String,
  Pos: String,
  SH: String,
  SO: String,
  SV: String,
  ["SV%"]: String,
  T: String,
  TOI: String,
  W: String,
});

export default GoalieGameStatsSchema;
