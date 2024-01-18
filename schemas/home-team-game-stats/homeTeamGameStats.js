import { Schema, model, models } from "mongoose";

const homeTeamStatsSchema = new Schema({
  ["Home1ST SHOTS"]: String,
  ["Home1ST GOALS"]: String,
  ["Home1X ATT"]: String,
  ["Home1X GOALS"]: String,
  ["Home2ND GOALS"]: String,
  ["Home2ND SHOTS"]: String,
  ["Home3RD GOALS"]: String,
  ["Home3RD SHOTS"]: String,
  HomeATTACK: String,
  HomeBREAKAWAY: String,
  ["HomeBREAKAWAY GOALS"]: String,
  HomeCHECKS: String,
  ["HomeFACEOFFS WON"]: String,
  HomeGOALS: String,
  ["HomeOT GOALS"]: String,
  ["HomeOT SHOTS"]: String,
  ["HomePASS ATT"]: String,
  ["HomePASS COMP"]: String,
  HomePENALTIES: String,
  ["HomePENALTY SHOT GOALS"]: String,
  ["HomePENALTY SHOTS"]: String,
  HomePIM: String,
  ["HomePP GOALS"]: String,
  ["HomePP MIN"]: String,
  ["HomePP OPP"]: String,
  ["HomePP SHOTS"]: String,
  HomeSHG: String,
  HomeSHOTS: String,
  HomeTeam: String,
});

const homeTeamGameStatsSchema = new Schema({
  gameStats: homeTeamStatsSchema, // Array of goal objects
});

const Home_Team_Stats =
  models.home_team_stat || model("home_team_stat", homeTeamGameStatsSchema);

export default Home_Team_Stats;
