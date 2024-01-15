import { Schema } from "mongoose";

const goalsScoredSchema = new Schema({
  ["ASSIST 1"]: String,
  ["ASSIST 2"]: String,
  GOALscorer: String,
  Period: String,
  TEAM: String,
  TIME: String,
  TYPE: String,
});

export default goalsScoredSchema;
