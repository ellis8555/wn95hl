import { Schema } from "mongoose";

const LeaguesConferencesSchema = new Schema({
  name: String,
  logo: String,
});

export default LeaguesConferencesSchema;
