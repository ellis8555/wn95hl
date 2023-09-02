import mongoose from "mongoose";
import getSeasonsModel from "@/schemas/season/season";

const queryForIfSeasonExists = async (leagueName, seasonNumber) => {
  const leagueDocument = `${leagueName}_season`;
  const getLeagueModels = mongoose.modelNames();

  const doesModelExist = getLeagueModels.includes(leagueDocument);

  if (doesModelExist) {
    const League = getSeasonsModel(leagueName);
    const getSeason = await League.findOne({ seasonNumber: seasonNumber });
    if (getSeason === null) {
      return false;
    }
  }
  return true;
};

export default queryForIfSeasonExists;
