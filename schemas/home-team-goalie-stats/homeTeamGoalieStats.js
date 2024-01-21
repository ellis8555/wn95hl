import { Schema, model, models } from "mongoose";
import GoalieGameStatsSchema from "../games/game-result/game-result-sub-schemas/goalieGameStats";

const goalieStatsSchema = new Schema(GoalieGameStatsSchema);

const homeTeamGoalieStatsSchema = new Schema({
  goalieStats: [goalieStatsSchema], // Array of goalie objects
});

const Home_Team_Goalie_Stats =
  models.home_team_goalie_stat ||
  model("home_team_goalie_stat", homeTeamGoalieStatsSchema);

export default Home_Team_Goalie_Stats;
