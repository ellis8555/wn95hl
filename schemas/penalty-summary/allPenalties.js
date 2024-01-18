import { Schema, model, models } from "mongoose";

const penaltySchema = new Schema({
  ["Pen#"]: String,
  PERIOD: String,
  TIME: String,
  TEAM: String,
  Penalty: String,
  Type: String,
});

const penaltiesSchema = new Schema({
  penalty: [penaltySchema], // Array of goal objects
});

const Penalty =
  models.penalty_summarie || model("penalty_summarie", penaltiesSchema);

export default Penalty;
