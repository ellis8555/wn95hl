import { Schema, model, models } from "mongoose";

const scoringSchema = new Schema({
  "Goal#": String,
  Period: String,
  TIME: String,
  TEAM: String,
  GOALscorer: String,
  ["ASSIST 1"]: String,
  ["ASSIST 2"]: String,
  TYPE: String,
});

const goalsScoredSchema = new Schema({
  goals: [scoringSchema], // Array of goal objects
});

const Scoring =
  models.scoring_summarie || model("scoring_summarie", goalsScoredSchema);

export default Scoring;
