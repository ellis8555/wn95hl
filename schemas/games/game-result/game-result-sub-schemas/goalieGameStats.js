import { Schema } from "mongoose";

const GoalieGameStatsSchema = new Schema({
  Name: String,
  Pos: String,
  G: String,
  A: String,
  PTS: String,
  SO: String,
  GA: String,
  SV: String,
  SH: String,
  ["SV%"]: String,
  W: String,
  L: String,
  T: String,
  OTL: String,
  TOI: String,
});

export default GoalieGameStatsSchema;
