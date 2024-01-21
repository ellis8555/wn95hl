import { Schema, model, models } from "mongoose";
import GoalieGameStatsSchema from "../games/game-result/game-result-sub-schemas/goalieGameStats";

const goalieStatsSchema = new Schema(GoalieGameStatsSchema);

const awayTeamGoalieStatsSchema = new Schema({
  goalieStats: [goalieStatsSchema], // Array of goalie objects
});

const Away_Team_Goalie_Stats =
  models.away_team_goalie_stat ||
  model("away_team_goalie_stat", awayTeamGoalieStatsSchema);

export default Away_Team_Goalie_Stats;
