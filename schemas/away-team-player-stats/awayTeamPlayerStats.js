import { Schema, model, models } from "mongoose";
import PlayerGameStatsSchema from "../games/game-result/game-result-sub-schemas/playerGameStats";

const playerStatsSchema = new Schema(PlayerGameStatsSchema);

const awayTeamPlayerStatsSchema = new Schema({
  playerStats: [playerStatsSchema], // Array of goalie objects
});

const Away_Team_Player_Stats =
  models.away_team_player_stat ||
  model("away_team_player_stat", awayTeamPlayerStatsSchema);

export default Away_Team_Player_Stats;
