import { Schema, model, models } from "mongoose";
import SeasonSchema from "./season-sub-schemas/season";

const W_LeagueSchema = new Schema({
  ...SeasonSchema.obj,
});

// statics list
// 1. getMostRecentSeasonNumber
// 2. queryForIfSeasonExists

W_LeagueSchema.statics.getMostRecentSeasonNumber = async function () {
  const getSeasonNumberFields = await this.find().select("seasonNumber").exec();
  const seasonNumbers = getSeasonNumberFields.map(
    (season) => season.seasonNumber
  );
  const mostRecentSeason = Math.max(...seasonNumbers).toString();
  return mostRecentSeason;
};

W_LeagueSchema.statics.queryForIfSeasonExists = async function (seasonNumber) {
  const getSeason = await this.findOne({ seasonNumber: seasonNumber });
  if (getSeason === null) {
    return false;
  }
  return true;
};

const W_Season = models.w_season || model("w_season", W_LeagueSchema);

export default W_Season;
