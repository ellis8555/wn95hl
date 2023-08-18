import { Schema } from "mongoose";

const PlayerGameStatsSchema = new Schema({
  A: String,
  CHK: String,
  G: String,
  Name: String,
  PIM: String,
  PPP: String,
  PTS: String,
  Pos: String,
  SHP: String,
  SOG: String,
  TOI: String,
});

export default PlayerGameStatsSchema;
