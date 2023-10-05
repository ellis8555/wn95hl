import { Schema } from "mongoose";

const penaltiesTakenSchema = new Schema({
  PERIOD: String,
  ["Pen#"]: String,
  Penalty: String,
  TEAM: String,
  TIME: String,
  Type: String,
});

export default penaltiesTakenSchema;
