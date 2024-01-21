import { Schema, model, models } from "mongoose";
import PlayerGameStatsSchema from "../games/game-result/game-result-sub-schemas/playerGameStats";

const playerStatsSchema = new Schema(PlayerGameStatsSchema);

const homeTeamPlayerStatsSchema = new Schema({
  playerStats: [playerStatsSchema], // Array of goalie objects
});

const Home_Team_Player_Stats =
  models.home_team_player_stat ||
  model("home_team_player_stat", homeTeamPlayerStatsSchema);

export default Home_Team_Player_Stats;
