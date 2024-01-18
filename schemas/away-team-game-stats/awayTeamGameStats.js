import { Schema, model, models } from "mongoose";

const awayTeamStatsSchema = new Schema({
  ["Away1ST GOALS"]: String,
  ["Away1ST SHOTS"]: String,
  ["Away1X ATT"]: String,
  ["Away1X GOALS"]: String,
  ["Away2ND GOALS"]: String,
  ["Away2ND SHOTS"]: String,
  ["Away3RD GOALS"]: String,
  ["Away3RD SHOTS"]: String,
  AwayATTACK: String,
  AwayBREAKAWAY: String,
  ["AwayBREAKAWAY GOALS"]: String,
  AwayCHECKS: String,
  ["AwayFACEOFFS WON"]: String,
  AwayGOALS: String,
  ["AwayOT GOALS"]: String,
  ["AwayOT SHOTS"]: String,
  ["AwayPASS ATT"]: String,
  ["AwayPASS COMP"]: String,
  AwayPENALTIES: String,
  ["AwayPENALTY SHOT GOALS"]: String,
  ["AwayPENALTY SHOTS"]: String,
  AwayPIM: String,
  ["AwayPP GOALS"]: String,
  ["AwayPP MIN"]: String,
  ["AwayPP OPP"]: String,
  ["AwayPP SHOTS"]: String,
  AwaySHG: String,
  AwaySHOTS: String,
  AwayTeam: String,
});

const awayTeamGameStatsSchema = new Schema({
  gameStats: awayTeamStatsSchema, // Array of goal objects
});

const Away_Team_Stats =
  models.away_team_stat || model("away_team_stat", awayTeamGameStatsSchema);

export default Away_Team_Stats;
