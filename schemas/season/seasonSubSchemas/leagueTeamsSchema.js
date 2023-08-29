import { Schema, models, model } from "mongoose";

const LeaguesTeamsSchema = new Schema({
  teamAcronym: String,
  conference: String,
  division: String,
});

export default LeaguesTeamsSchema;
