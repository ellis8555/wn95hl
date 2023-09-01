import getSeasonsModel from "@/schemas/season/season";

const queryForIfSeasonExists = async (leagueName, seasonNumber) => {
  const leagueCollection = `${leagueName}_seasons`;
  const SeasonModel = getSeasonsModel(leagueCollection);

  const doesSeasonExist = await SeasonModel.findOne({
    seasonNumber: seasonNumber,
  });

  if (doesSeasonExist === null) {
    return false;
  }
  return true;
};

export default queryForIfSeasonExists;
