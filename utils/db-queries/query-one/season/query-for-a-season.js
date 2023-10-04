import W_Season from "@/schemas/season/w_season";

const queryForIfSeasonExists = async (seasonNumber) => {
  const getSeason = await W_Season.findOne({ seasonNumber: seasonNumber });
  if (getSeason === null) {
    return false;
  }
  return true;
};

export default queryForIfSeasonExists;
