import { Schema, model, models } from "mongoose";
import SeasonSchema from "./seasonSubSchemas/season";

const W_LeagueSchema = new Schema({
  ...SeasonSchema.obj,
});

const W_Season = models.w_season || model("w_season", W_LeagueSchema);

export default W_Season;
