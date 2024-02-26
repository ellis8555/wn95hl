import { Schema, Types } from "mongoose";

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
    awayTeamGoalieStats: {
      type: Types.ObjectId,
      ref: "Away_Team_Goalie_Stats",
    },
    homeTeamGoalieStats: {
      type: Types.ObjectId,
      ref: "Home_Team_Goalie_Stats",
    },
    awayTeamPlayerStats: {
      type: Types.ObjectId,
      ref: "Away_Team_Player_Stats",
    },
    homeTeamPlayerStats: {
      type: Types.ObjectId,
      ref: "Away_Team_Player_Stats",
    },
    gameHighlights: {
      type: Types.ObjectId,
      ref: "Game_Highlights",
      default: null,
    },
    csvFormattedGameData: {
      type: Types.ObjectId,
      ref: "Csv_game_stats"
    }
  },
  {
    timestamps: true,
  }
);

export default GameResultSchema;
