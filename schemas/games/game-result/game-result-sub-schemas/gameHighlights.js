import { Schema } from "mongoose";

const GameHighlightSchema = new Schema(
  {
    href: String,
    description: {
      type: String,
      default: "",
    },
    usernameOne: {
      type: String,
      default: "",
    },
    usernameTwo: {
      type: String,
      default: "",
    },
    gameType: {
      type: String,
      default: "",
    },
    leagueName: {
      type: String,
      default: "",
    },
    seasonNumber: {
      type: String,
      default: "",
    },
    gameWinner: {
      type: Boolean,
      default: false,
    },
    seriesWinner: {
      type: Boolean,
      default: false,
    },
    championshipSeriesWinner: {
      type: Boolean,
      default: false,
    },
    goalScorer: {
      type: String,
      default: "",
    },
    goalScorerGoalNumberOfSeason: {
      type: String,
      default: "",
    },
    goalScorerGoalNumberOfPlayoffs: {
      type: String,
      default: "",
    },
    goalScorerGoalNumberOfSeasonCareer: {
      type: String,
      default: "",
    },
    goalScorerGoalNumberOfPlayoffCareer: {
      type: String,
      default: "",
    },
    goalScorerGoalNumberOfCareer: {
      type: String,
      default: "",
    },
    goalScorerGoalNumberOfCareer: {
      type: String,
      default: "",
    },
    assistOne: {
      type: String,
      default: "",
    },
    assistTwo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default GameHighlightSchema;
