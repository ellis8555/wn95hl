import { Schema } from "mongoose";

const penaltiesTakenSchema = new Schema({
  ["Pen#"]: String,
  PERIOD: String,
  Penalty: String,
  TEAM: String,
  TIME: String,
  Type: String,
});

export default penaltiesTakenSchema;
