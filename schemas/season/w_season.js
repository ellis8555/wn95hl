import { Schema, model, models } from "mongoose";
import SeasonSchema from "./seasonSubSchemas/season";

const W_LeagueSchema = new Schema({
  ...SeasonSchema.obj,
});

W_LeagueSchema.statics.getMostRecentSeasonNumber = async function () {
  const getSeasonNumberFields = await this.find({})
    .select("seasonNumber")
    .exec();
  let listOfSeasonNumbers = [];
  getSeasonNumberFields.forEach((season) => {
    listOfSeasonNumbers.push(season.seasonNumber);
  });
  const mostRecentSeason = Math.max(...listOfSeasonNumbers);
  return mostRecentSeason;
};

const W_Season = models.w_season || model("w_season", W_LeagueSchema);

export default W_Season;
