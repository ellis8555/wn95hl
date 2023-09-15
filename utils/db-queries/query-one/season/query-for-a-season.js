import mongoose from "mongoose";
import getSeasonsModel from "@/schemas/season/season";

const queryForIfSeasonExists = async (leagueName, seasonNumber) => {
  const leagueCollection = `${leagueName}_season`;
  const getLeagueModels = mongoose.modelNames();

  const doesLeagueExist = getLeagueModels.includes(leagueCollection);

  if (doesLeagueExist) {
    const League = getSeasonsModel(leagueName);
    const getSeason = await League.findOne({ seasonNumber: seasonNumber });
    if (getSeason === null) {
      return false;
    }
  }
  return true;
};

export default queryForIfSeasonExists;
