import { Schema, Types } from "mongoose";
import GoalieGameStatsSchema from "./game-result-sub-schemas/goalieGameStats";
import PlayerGameStatsSchema from "./game-result-sub-schemas/playerGameStats";
import GameHighlight from "./game-result-sub-schemas/gameHighlights";

const GameResultSchema = new Schema(
  {
    otherGameStats: {
      league: String,
      seasonNumber: String,
      gameType: String,
      overtimeRequired: Boolean,
      overtimeLossTeam: String,
      homeTeam: String,
      awayTeam: String,
      homeTeamPoints: String,
      awayTeamPoints: String,
      winningTeam: String,
      losingTeam: String,
      faceOffs: String,
      ["GAME LENGTH"]: String,
      uniqueGameId: String,
      submittedAt: Date,
    },
    allGoalsScored: { type: Types.ObjectId, ref: "Scoring" },
    allPenalties: { type: Types.ObjectId, ref: "Penalty" },
    awayTeamGameStats: { type: Types.ObjectId, ref: "Away_Team_Stats" },
    homeTeamGameStats: { type: Types.ObjectId, ref: "Home_Team_Stats" },
    awayTeamGoalieStats: [GoalieGameStatsSchema],
    homeTeamGoalieStats: [GoalieGameStatsSchema],
    awayTeamPlayerStats: [PlayerGameStatsSchema],
    homeTeamPlayerStats: [PlayerGameStatsSchema],
    gameHighlights: {
      type: [GameHighlight],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default GameResultSchema;
