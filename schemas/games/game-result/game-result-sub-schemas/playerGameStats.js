import { Schema } from "mongoose";

const PlayerGameStatsSchema = new Schema({
  Name: String,
  Pos: String,
  G: String,
  A: String,
  PTS: String,
  SOG: String,
  CHK: String,
  PIM: String,
  PPP: String,
  SHP: String,
  TOI: String,
});

export default PlayerGameStatsSchema;
