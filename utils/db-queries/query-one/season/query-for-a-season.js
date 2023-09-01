import getSeasonsModel from "@/schemas/season/season";

const queryForIfSeasonExists = async (
  leagueName,
  seasonNumber,
  createIfNotExists
) => {
  const leagueDocument = `${leagueName}_seasons`;
  const SeasonModel = getSeasonsModel(leagueDocument, createIfNotExists);

  if (!SeasonModel) {
    return false; // Model doesn't exist, so the season doesn't exist
  }

  const doesSeasonExist = await SeasonModel.findOne({
    seasonNumber: seasonNumber,
  });

  if (doesSeasonExist === null) {
    return false;
  }
  return true;
};

export default queryForIfSeasonExists;
